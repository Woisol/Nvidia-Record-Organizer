import TitleBar from "./components/TitleBar"
import Home from "./components/Home"
import '../main.css'
import { useEffect, useState } from "react";
function App(): JSX.Element {
  const [curDir, setCurDir] = useState("");
  // @ts-ignore
  useEffect(() => { window.store.get('curDir').then(res => setCurDir(res)) }, [])
  window.electron.ipcRenderer.on('update-cur-dir', (event, arg) => { setCurDir(arg) });

  return (
    <>
      <TitleBar curDir={curDir} />
      <Home curDir={curDir} />
    </>
  )
}

export default App
