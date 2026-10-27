/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Spectra Web: replaces the firefox-branding.js that Surfer generates
// (node_modules/@zen-browser/surfer/dist/commands/patches/branding-patch.js, configureProfileBranding),
// which points the first-run / after-update pages at zen-browser.app.
// scripts/spectraweb-apply-branding.cjs copies this file over the generated one.

// No web pages on first run, after an update, or on the second first-run tab.
pref("startup.homepage_override_url", "");
pref("startup.homepage_welcome_url", "");
pref("startup.homepage_welcome_url.additional", "");

// Give the user x seconds to react before showing the big UI. default=192 hours
pref("app.update.promptWaitTime", 691200);
// app.update.url.manual: URL user can browse to manually if for some reason
// all update installation attempts fail.
// app.update.url.details: a default value for the "More information about this
// update" link supplied in the "An update is available" page of the update
// wizard.
pref("app.update.url.manual", "https://github.com/V1ri0n/SpectraWeb/releases");
pref("app.update.url.details", "https://github.com/V1ri0n/SpectraWeb/releases");
pref("app.releaseNotesURL", "https://github.com/V1ri0n/SpectraWeb/releases");
pref("app.releaseNotesURL.aboutDialog", "https://github.com/V1ri0n/SpectraWeb/releases");
pref("app.releaseNotesURL.prompt", "https://github.com/V1ri0n/SpectraWeb/releases");

// Number of usages of the web console.
// If this is less than 5, then pasting code into the web console is disabled
pref("devtools.selfxss.count", 5);
