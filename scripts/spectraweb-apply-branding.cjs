// Spectra Web: regenerate engine/browser/branding/release from configs/branding/release (names + icons from
// surfer.json), then replace the generated pref/firefox-branding.js (zen-browser.app URLs) with
// configs/spectraweb/firefox-branding.js.
//
// Run from the repo root:  node scripts/spectraweb-apply-branding.cjs
// Needed after: changing surfer.json brand names, icons in configs/branding/release, or `surfer import`.
// Then rebuild: `python3 ./mach build faster` in engine/ (prefs/branding only) or a full build.
const fs = require('node:fs')
const path = require('node:path')

// Surfer's index.js parses process.argv at load time and exits on --version; stub the exit while loading.
const realExit = process.exit
process.argv = [process.argv[0], 'surfer', '--version']
process.exit = () => {}
const branding = require(path.join(process.cwd(), 'node_modules/@zen-browser/surfer/dist/commands/patches/branding-patch.js'))
process.exit = realExit

const brand = process.env.SPECTRAWEB_BRAND || 'release'
branding
  .apply(brand)
  .then(() => {
    const from = path.join(process.cwd(), 'configs/spectraweb/firefox-branding.js')
    const to = path.join(process.cwd(), 'engine/browser/branding', brand, 'pref/firefox-branding.js')
    fs.copyFileSync(from, to)
    console.log(`branding "${brand}" applied; firefox-branding.js replaced: ${to}`)
  })
  .catch((e) => {
    console.error('ERR', e.stack || e.message)
    process.exit(1)
  })
