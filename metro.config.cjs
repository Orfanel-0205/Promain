// CommonJS only - no NativeWind metro (avoids ESM/Windows path error).
// NativeWind still works via Babel + global.css in app; Tailwind classes are applied at build time.
'use strict';
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
module.exports = config;
