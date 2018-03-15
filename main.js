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
    // console.log(res.statusCode);
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
let Tray = electron.Tray;
let tray = null;
let Menu = electron.Menu;
let MenuItem = electron.MenuItem

var template = [
  {
    label: '关闭',
    click: function () { mainWindow.close();console.log("关闭")},
  },
  {
    label: '刷新',
    click: function () { mainWindow.reload();console.log("关闭")},
  }
]
var menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu);
// const menuIteam_first = new MenuItem({
// 	label:"Electron",
// 	submenu: [
// 		{
//       //需要通过cmd来启动
// 			label:"show sth in cmd",
// 			click(){
// 				console.log("clickLabel")
// 			}
// 		},
// 		{
//       //创建一个新的窗口
// 			label:"new window",
// 			accelerator:"CmdOrCtrl+N",
// 			role:"",
// 			click(){
// 				let newwindow = new BrowserWindow({
// 					width: 400, 
//       				height: 300,
// 					resizable:false
// 				})
// 				newwindow.loadURL('file://' + __dirname + '/source/electron1.jpg');
// 				newwindow.on("closed",function(){
// 					newwindow = null
// 				})
// 			}
// 		},
// 		{
//       //可以看到一个选中的选项
// 			label: 'checked', 
// 			type: 'checkbox', 
// 			checked: true
// 		},
// 		{
//         	//所有menuIteam的label都可以有submenu
// 			label: 'Gender', 
// 			submenu:[
// 				{
// 					label:"male",
// 					type:"radio",
// 					checked:true
// 				},
// 				{
// 					label:"female",
// 					type:"radio",
// 					checked:false
// 				},
// 				{
// 					label:"computer",
// 					type:"radio",
// 					checked:true
// 				}
// 			]
// 		},
// 		{
//      	//只写role可以调用一些默认的设置，比如这个是全屏
// 			role: 'togglefullscreen'
// 		},
// 		{
//      	//accelerator是定义快捷键，click可以按自己需要写
// 			label: 'Developer Tools',
// 			accelerator: process.platform === 'darwin' ? 'CmdOrCtrl+I' : 'CmdOrCtrl+I',
// 			click(item, focusedWindow) {
// 			if (focusedWindow)
// 				focusedWindow.webContents.toggleDevTools();
// 			}
// 		},
// 		{	
//      	//可以调用role默认的同时重写一些需要的内容
// 			label:"GOODBYE",
// 			role:"quit",
// 			accelerator:"CmdOrCtrl+Q"
// 		}
// 	]
// });

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({show: false, title: 'ZB'})
  mainWindow.maximize()
  mainWindow.setMenuBarVisibility(true)
  mainWindow.show()

  const options = {"extraHeaders" : "pragma: no-cache\n"}
  console.log("Domain: "+ dnsMap["domain"][dnsIdx] + ", " + dnsIdx)
  mainWindow.loadURL("https://" + dnsMap["domain"][dnsIdx] + "/", options)
  dnsIdx++

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
    // console.log('did-fail-load')
    if (dnsIdx < dnsMap["domain"].length) {
      console.log(dnsIdx)
        mainWindow.webContents.loadURL("https://" + dnsMap["domain"][dnsIdx++] + "/")
    }
    
  });

  const nativeImage = electron.nativeImage
  let image = nativeImage.createFromPath('img/favicon_red.ico')
  tray = new Tray(image)
  const contextMenu = Menu.buildFromTemplate([
    // {
    //   label:"show",
    //   click(){
    //     mainWindow.show()
    //   }
    // },
    {
      label:"Exit",
      role:"quit"
    }
  ])
  tray.setContextMenu(contextMenu)
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
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
