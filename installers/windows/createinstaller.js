const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'dist/')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'ZB-win32-x64/'),
    authors: 'Harry Zhang',
    noMsi: false,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'ZB.exe',
    setupExe: 'ZBInstaller.exe',
    setupIcon: path.join(rootPath, 'img/favicon_red.ico')
  })
}
