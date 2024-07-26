import Home from "./components/Home"
import { useEffect, useState } from "react";
// import { Route, Routes } from "react-router-dom";
// import Setting from "./components/Setting/Setting";
import clearSlection from "./ts/DOMOps";
function App(): JSX.Element {
  const [curDir, setCurDir] = useState("");
  // @ts-ignore
  useEffect(() => { window.store.get('curDir').then(res => setCurDir(res)) }, [])
  window.electron.ipcRenderer.on('update-cur-dir', (_event, arg) => {
    setCurDir(arg);
  });
  window.electron.ipcRenderer.on('clear-selection', () => clearSlection())

  return (
    // ！经过location.reload()在控制台内多次调试后得出结论，这里能进到App()，但是无法进入Home()…………初步怀疑可能是Routes的问题
    // !不过虽然但是为什么控制台两个异常处暂停都勾选了还是没有给我停住？（）
    // ！解决！！！！！！！所以说一定要学会用好控制台！！！！！
    // <Routes >
    //   <Route path="/" element={<Home curDir={curDir} />} />
    //   <Route path="/Settings" element={<Setting />} />
    // </Routes>
    <Home curDir={curDir} />
  )
}
export default App

/**
 * !关于打包……
 * !1. 之前git的报错未经处理的异常:  System.MissingMethodException: 找不到方法:“System.String GitCredentialManager.ApplicationBase.GetEntryApplicationPath()”。在 GitCredentialManager.Program.Main(String[] args)
 * !其实就是git的问题，现在重新安装以后正常了
 * !2. vsc无法直接上传，这次采用的方法是在github上先创建Respository，然后git remote add origin https:/github.com/xxx | git branch --set-upstream-to=origin/main
 * !git pull遇到fatal: refusing to merge unrelated histories就使用git pull --allow-unrelated-histories来和本地仓库合并，之后再git push origin即可
 * !3.另外看到git pull其实就是git fetch和git merge的结合
 *
 * !终于打包成功，之前一直白屏
 * !尝试了不断修改electron.vite.config.ts，但是已经明确build就是放在renderer下了不然就报错的……
 *
 * ！打包后白屏的问题，主要就是两种可能
 * !要么打包后的文件路径错误了，但是这点electron-vite处理得挺好的至少这次打包其实都没有出现这类错误
 * !要么打包后代码报错。这是有可能的，这次就是打包后实际上不支持React-Routes-DOM
 * !注意结合location.reload(看控制台！有报错看报错，没有报错也调试一下看看是哪里断掉了…………
 */