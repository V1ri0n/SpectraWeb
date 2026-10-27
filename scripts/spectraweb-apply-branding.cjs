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

    // Surfer's branding.nsi points the "Programs and Features" links (about, help, update info) and the
    // manual download page at zen-browser.app / the Zen repo.
    const nsi = path.join(process.cwd(), 'engine/browser/branding', brand, 'branding.nsi')
    const fork = 'https://github.com/V1ri0n/SpectraWeb'
    let text = fs.readFileSync(nsi, 'utf8')
    const replacements = [
      ['"https://zen-browser.app/release-notes/${AppVersion}"', `"${fork}/releases"`],
      ['"https://github.com/zen-browser/desktop/issues"', `"${fork}/issues"`],
      ['"https://zen-browser.app/download"', `"${fork}/releases"`],
      ['"https://zen-browser.app"', `"${fork}"`],
    ]
    for (const [oldText, newText] of replacements) {
      if (!text.includes(oldText)) console.warn(`branding.nsi: not found (already replaced?): ${oldText}`)
      text = text.split(oldText).join(newText)
    }
    fs.writeFileSync(nsi, text)
    console.log(`branding.nsi links replaced: ${nsi}`)
  })
  .catch((e) => {
    console.error('ERR', e.stack || e.message)
    process.exit(1)
  })
