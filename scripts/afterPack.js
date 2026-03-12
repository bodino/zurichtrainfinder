const { execSync } = require('child_process');

exports.default = async function (context) {
  const appPath = `${context.appOutDir}/${context.packager.appInfo.productFilename}.app`;
  console.log(`Ad-hoc signing: ${appPath}`);
  execSync(`codesign --force --deep --sign - "${appPath}"`, { stdio: 'inherit' });
};
