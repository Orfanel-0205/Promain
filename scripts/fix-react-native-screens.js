// scripts/fix-react-native-screens.js
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const packageDir = path.join(root, "node_modules", "react-native-screens");
const srcDir = path.join(packageDir, "src");
const indexFile = path.join(srcDir, "index.js");

if (!fs.existsSync(packageDir)) {
  console.warn("react-native-screens is not installed; skipping patch.");
  process.exit(0);
}

if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

const content = "module.exports = require('../lib/commonjs/index.js');\n";
if (
  !fs.existsSync(indexFile) ||
  fs.readFileSync(indexFile, "utf8") !== content
) {
  fs.writeFileSync(indexFile, content, "utf8");
  console.log("Patched react-native-screens src/index.js");
} else {
  console.log("react-native-screens patch already present");
}
