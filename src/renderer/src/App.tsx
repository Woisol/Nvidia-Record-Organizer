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
