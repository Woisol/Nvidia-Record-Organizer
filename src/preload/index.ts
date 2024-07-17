import { contextBridge,ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// ！woc！！！原来preload可以直接把函数，变量暴露给渲染进程！！都不需要你之前的进程间通讯艹
const store = {
  // @ts-ignore
  get: async(key: string) => { const res = await ipcRenderer.invoke("electron-store-get", key);  console.log("res:", res); return res;},
  // @ts-ignore
  set: (key: string, value: any) => ipcRenderer.send("electron-store-set", key, value)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // contextBridge.exposeInMainWorld('api', api)
    // contextBridge.exposeInMainWorld('store', new Store())
    contextBridge.exposeInMainWorld('store', store);
  } catch (error) {
    console.error(error)
  }
  console.log("preload with contextBridge");
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore
  window.store = store;
  // @ts-ignore
  window.fs = require('fs');
  console.log("preload without contextBridge");
}

document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('DOMContentLoaded')
})