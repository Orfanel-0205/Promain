// Re-export .cjs so Node loads it as CommonJS (avoids ESM/Windows path error).
// Do not add NativeWind or other requires here; keep this file minimal.
'use strict';
module.exports = require('./metro.config.cjs');
