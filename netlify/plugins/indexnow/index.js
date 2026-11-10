// IndexNow: after every successful PRODUCTION deploy, tell Bing (and the other
// IndexNow engines — Yandex, Seznam, Naver; Bing shares with Copilot/ChatGPT
// search) which URLs exist, so new and changed pages are recrawled in minutes,
// not weeks. The key file is static/1991eab60a5276cd28e81de1071b8c65.txt — it must stay
// published at the site root, or the engines reject the submission.
// Never fails the build: a ping problem is logged and ignored.
const fs = require('fs')
const path = require('path')

const HOST = 'picsell.ai'
const KEY = '1991eab60a5276cd28e81de1071b8c65'

module.exports = {
  async onSuccess({ constants, utils }) {
    if (process.env.CONTEXT !== 'production') {
      console.log('[indexnow] skipped: context', process.env.CONTEXT)
      return
    }
    try {
      // Hugo writes a sitemap index (sitemap.xml -> uk/sitemap.xml, en/sitemap.xml);
      // follow it one level down, reading the child files from the publish dir.
      const locs = (rel) => {
        const xml = fs.readFileSync(path.join(constants.PUBLISH_DIR, rel), 'utf8')
        return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
      }
      const prefix = 'https://' + HOST + '/'
      const all = []
      for (const u of locs('sitemap.xml')) {
        if (u.endsWith('.xml') && u.startsWith(prefix)) all.push(...locs(u.slice(prefix.length)))
        else all.push(u)
      }
      const urls = [...new Set(all)].filter((u) => u.startsWith(prefix) && !u.endsWith('.xml'))
      if (!urls.length) { console.log('[indexnow] no URLs in sitemap'); return }
      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: urls.slice(0, 10000) }),
      })
      console.log('[indexnow] submitted', urls.length, 'URLs →', res.status, res.statusText)
    } catch (e) {
      console.log('[indexnow] failed (ignored):', e && e.message)
    }
  },
}
