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
    // ！使用_可以消除未使用变量的警告！
    setCurDir(arg);
  });
  window.electron.ipcRenderer.on('clear-selection', () => clearSlection())

  return (
    <Routes >
    //   {/* //!这个也是……开始补全的Router………… */}
    //   {/* //td不知道补全了什么出来history={window.history} */}
    //   {/* <Switch> */}
      <Route path="/" element={<Home curDir={curDir} />} />
      <Route path="/Settings" element={<Setting />} />
    //   {/* //！艹服了补全的时Componet不能传递参数…………区分Componet和element！ */}
    //   {/* </Switch>  */}
    </Routes>
    // <Home curDir={curDir} />
  )
}
export default App
