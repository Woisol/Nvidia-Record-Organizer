import Home from "./components/Home"
import '../main.css'
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Setting from "./components/Setting/Setting";
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
    <Routes >
      <Route path="/" element={<Home curDir={curDir} />} />
      <Route path="/Settings" element={<Setting />} />
    </Routes>
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
 */