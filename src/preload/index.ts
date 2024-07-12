// console.log("Enter Index.ts");
// !根本就没有进这里………………
import { contextBridge,ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { runInThisContext } from 'vm';
// import electronStore from 'electron-Store'
// !用这个导入方式，输出的preload/index.js会比原本多出15639代码，加载巨慢，而且会多出了对projectName的判断而throw出错，进而导致下面的所有代码都不会执行
// const electronStore = require('electron-store');
// !用这个则不会报错，但是依然报错无法执行preload……
// const electronstore = new electronStore()
// import { isModuleNamespaceObject } from 'util/types';
// import fs from 'fs';
// !导入fs都没问题，都可以正常访问window.electron但是导入electronstore就不行
// const store = new Store();
// import("electron-store").then(electronStore => {
// !根据报错用这个方式来导入但是直接连devtool都打不开了
  // @ts-ignore
// const electronstore = new electronStore();
//**----------------------------初始代码-----------------------------------------------------
// Custom APIs for renderer
// const api = {
//   // __dirname: __dirname
//   // !这个是要在这里手动暴露的！electron-store要用到！控制台暴露了！
//   // !额加了也不行，应该不是不暴露的原因，是preload没有加载成功吧？

//   store:new electronStore()
// }
// ！woc！！！原来preload可以直接把函数，变量暴露给渲染进程！！都不需要你之前的进程间通讯艹
const store = {
  // @ts-ignore
  get: async(key: string) => { const res = await ipcRenderer.invoke("electron-store-get", key);  console.log("res:", res); return res;},
  // get: async(key: string) => { ipcRenderer.invoke("electron-store-get", key).then(res=>{console.log("res:", res); return res;}) },
  // !二者一样的
  // @ts-ignore
  set: (key: string, value: any) => ipcRenderer.send("electron-store-set", key, value)
  // delete: (key: string) => electronstore.delete(key),
}
// console.log("store:", store);
// !electron官方规范，不应该传递过高的api防止渲染进程误操作

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // contextBridge.exposeInMainWorld('api', api)
    // contextBridge.exposeInMainWorld('store', new Store())
    contextBridge.exposeInMainWorld('store', store);
    // !人都傻了…………你已经设置了contextIsolated false了所以用的是下面的代码！
  } catch (error) {
    console.error(error)
  }
  console.log("preload with contextBridge");
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  // ！woc！！真神奇！上面这个语句加了就可以忽略TS的检查哈哈
  // window.api = api;
  // @ts-ignore
  window.store = store;
  console.log("preload without contextBridge");
}
//**----------------------------自定代码-----------------------------------------------------
// })