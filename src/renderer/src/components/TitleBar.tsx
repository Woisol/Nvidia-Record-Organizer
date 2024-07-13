import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import '../../main.css'
// !还得在每个组件里面都要导入一次吗………………
import icon from '../../../../resources/Icon.png'
import iconBtnRefresh from '../../../../resources/btn-refresh.png'
import iconBtnSetting from '../../../../resources/btn-setting.png'
import iconBtnHelp from '../../../../resources/btn-help.png'

import { HelpOutline, Refresh, SettingsOutlined } from '@mui/icons-material'

// import path from 'path';
// import Store from 'electron-store';
// !定位问题！就是这里报错没有定义__dirname导致完全没有显示…………
// !行吧加了nodeIntegration依然报错，查到是说vite为了兼容性将path等nodejs模块外部化了无法调用
// !老老实实用api吧…………
// const store = new Store();

export default function TitleBar(): JSX.Element {
  // const [curDir, setCurDir] = useState((() => window.store.get('curDir').then(res => { console.log("res:", res); return res }))());
  const [curDir, setCurDir] = useState('');
  // !行吧……只能这么解释了，useState不支持异步操作，所以必须在外部用useEffect才能异步获取数据！啊等等………………这哪是异步（）
  // @ts-ignore
  useEffect(() => { window.store.get('curDir').then(res => { console.log("res:", res); setCurDir(res); }) },)
  // ！注意想只在挂载时执行一次的另一个方法是用useEffect！
  console.log("curDir:", curDir);
  // console.log("windows.store:", window.store);
  // console.log("window.electron:", window.electron);
  // !再次注意不是{}是[]！
  window.electron.ipcRenderer.on('update-record-data', () => { (document.getElementById('btn-refresh') as HTMLButtonElement).children[0].classList.remove('rotate') });
  return (
    <div className="titleBar">
      <img src={icon} alt="NROR" className='w-5 h-5' draggable='false' />
      {/* <img src={path.join(__dirname, "../resources/Icon.png")} alt="NROR" />用什么path.join………… */}
      <span className='ml-1'>当前目录:{curDir}</span>
      {/* //td考虑加个单击复制目录 */}
      <button className='h-fit ml-3 px-3 py-[2px] rounded-md bg-gray-300 transition-all shadow-md hover:scale-110 active:bg-gray-400 active:scale-90 '>更改</button>
      <div className="dragZone"></div>
      <div className="titleBar-extendBtn-region">
        <button id='btn-refresh' className='titleBar-extendBtn group' onClick={() => { (document.getElementById('btn-refresh') as HTMLButtonElement).children[0].classList.add('rotate'); window.electron.ipcRenderer.send('request-update-record-data') }}>
          {/* //!断言也可以去掉可能为null的报错哈哈 */}
          {/* <Refresh /> */}
          <img src={iconBtnRefresh} alt="Refresh" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
        </button>
        <button id='btn-setting' className='titleBar-extendBtn group' >
          {/* <SettingsOutlined /> */}
          <img src={iconBtnSetting} alt="Setting" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
        </button>
        <button className='titleBar-extendBtn group'>
          {/* <HelpOutline /> */}
          <img src={iconBtnHelp} alt=" Help" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
        </button>
      </div>
      <div className='w-32'></div>
    </div>
  )
}
// @ts-ignore


