//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

  

// Get DNS map from local file.
var path = require('path')
var dnsMapFile = path.join(__dirname, 'dns_map')
console.log(dnsMapFile)
var fs = require('fs')
var dnsMap = []
var dnsIdx = 0
try {
  if (fs.statSync(dnsMapFile).isFile()) {
    dnsMap = JSON.parse(fs.readFileSync(dnsMapFile, "utf8"))
    console.log(dnsMap["domain"])
  }
} catch (e) {
  console.log(dnsMapFile + " does not exist.")
}
var http=require("http");
var options={
    hostname: "47.89.60.167",
    port: 8080,
    path: '/domain.json'
}
var reqHostIp=http.get(options, function(res){
    res.setEncoding("utf-8");
    res.on("data", function(chunk){
        fs.writeFileSync(dnsMapFile, chunk)
      });
    console.log(res.statusCode);
});
reqHostIp.on("error",function(err){
    console.log(err.message);
});


const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({show: false, title: 'ZB'})
  mainWindow.maximize()
  mainWindow.setMenuBarVisibility(true)
  mainWindow.show()

  const options = {"extraHeaders" : "pragma: no-cache\n"}
  console.log("Domain: "+ dnsMap["domain"][dnsIdx] + ", " + dnsIdx)
  mainWindow.loadURL("https://" + dnsMap["domain"][dnsIdx] + "/", options)
  // mainWindow.loadURL("https://192.168.1.123/", options)
  dnsIdx++
  console.log('URL: ' + mainWindow.webContents.getURL())

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.webContents.on('did-fail-load', () => {
    console.log('did-fail-load')
    if (dnsIdx < dnsMap["domain"].length) {
      console.log(dnsIdx)
      mainWindow.webContents.loadURL("https://" + dnsMap["domain"][dnsIdx++] + "/")
    }
    
  });
}

function startMainApp() {
  app.commandLine.appendSwitch('host-resolver-rules', 'MAP www.zb.com 54.192.232.254')
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
}

startMainApp()
