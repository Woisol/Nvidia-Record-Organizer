/**
 * !哭了呜初始化项目又搞了好久
 * 一开始是用了npm create vite@latest，问ai差点要加后面的一堆参数但是其实这样就行用命令行选择
 * 但是这个是vite…………不是electron-vite…………也注意有两个官网一个vite一个专门的electron-vite
 * 找不到用electron-vite的，然后尝试了用npm create electron-vite@latest构建出来了，也确实能用npm run dev启动
 * 但是无法用VSC调试，官网上有launch.json的配置但是调用了node_modules里面的electron-vite，默认是没有装的，装了用debug-all也无法调试，一直连接超时，尝试了改成run dev里面的vite无效，改端口无效，改chrome为msedge无效
 * 最后才在electron-vite官网->快速开始里面找到这条npm create @quick-start/electron@latest呜才终于得麻了
 */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
// import electronStore from 'electron-store'
// const electronStore = require('electron-store')
// !在这里用这两个是直接弹报错窗口进都进不去
// const store = new electronStore()
// !艹main里面也不行…………
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    // show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      // !对不起以为不是js是ts…………
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(255, 255, 255, 0.2)',
      // !woc怎么这么好看！！！教程上面用的(0,0,0,0)，但是这样没有悬浮效果了
      height: 32,
      symbolColor: 'black',
    },
    title: 'Nvidia Record Organizer',
    // !但是任务栏上显示的并不是这个而是HTML里面的
    icon: path.join(__dirname, '../../resources/icon.png'),
    minWidth: 600,
    minHeight: 400,
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools();
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
import('electron-store').then(res => {
  // @ts-ignore
  const store = new res.default();
  // !注意这里返回的是res！要res.default才能访问的import的模块！
  ipcMain.handle("electron-store-get", async(event, key) => {
    // ~~event.sender.send("electron-store-get-reply", store.get(key));
    // ~~event.reply
    // !虽然on的event.sender也可以返回但是渲染进程不会等待！
    // @ts-ignore
    return store.get(key);
  })
  ipcMain.on("electron-store-set", (event, key, value) => {
    // @ts-ignore
    store.set(key, value);
  })
  // **配置默认设置
// @ts-ignore
const displaySize = store.get('displaySize');
if (!displaySize) {
  const defaultSetting = {
    curDir:path.join(app.getPath('videos'),"Yuan Shen 原神"),
    // ！获取系统Video位置！
    // !同时不应该用字符串拼接的方式……
    displaySize: 1,
    maxGroupCount: 5,
    autoSort: true,
    autoRefresh: 1
  }
  // @ts-ignore
  store.set(defaultSetting);
}
})