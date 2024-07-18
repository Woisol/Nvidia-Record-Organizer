import { useEffect, useState } from 'react'
import '../../main.css'
import icon from '../../../../resources/Icon.png'
import iconBtnRefresh from '../../../../resources/btn-refresh.png'
import iconBtnSetting from '../../../../resources/btn-setting.png'
import iconBtnHelp from '../../../../resources/btn-help.png'

// import { HelpOutline, Refresh, SettingsOutlined } from '@mui/icons-material'
type Props = {
  curDir: string
}
export default function TitleBar({ curDir }: Props): JSX.Element {
  window.electron.ipcRenderer.on('update-record-data', () => { (document.getElementById('btn-refresh') as HTMLButtonElement).children[0].classList.remove('rotate') });
  return (
    <>
      <div className='w-full h-8'></div>
      <div className="titleBar">
        <img src={icon} alt="NRO" className='w-5 h-5' draggable='false' />
        {/* <img src={path.join(__dirname, "../resources/Icon.png")} alt="NROR" />用什么path.join………… */}
        <span id='titlebar-curDir' className='ml-1 overflow-hidden text-ellipsis whitespace-nowrap' onContextMenu={e => window.electron.ipcRenderer.send('contextmenu-cur-dir')}>当前目录:{curDir}</span>
        {/* //td考虑加个单击复制目录 */}
        {/* //!text-right无效 */}
        <button className='h-5 ml-3 px-3 py-[2px] rounded-md bg-gray-300 transition-all shadow-md text-nowrap hover:scale-110 active:bg-gray-400 active:scale-90 ' onClick={() => { window.electron.ipcRenderer.send('request-change-cur-dir') }}>更改</button>
        <div className="dragZone min-w-8"></div>
        <div className="titleBar-extendBtn-region">
          <button id='btn-refresh' className='titleBar-extendBtn group' onClick={() => { (document.getElementById('btn-refresh') as HTMLButtonElement).children[0].classList.add('rotate'); window.electron.ipcRenderer.send('request-update-record-data') }}>
            {/* <Refresh /> */}
            <img src={iconBtnRefresh} alt="Refresh" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
          </button>
          <button id='btn-setting' className='titleBar-extendBtn group' onClick={() => { window.electron.ipcRenderer.send('open-settings') }} >
            {/* <SettingsOutlined /> */}
            <img src={iconBtnSetting} alt="Setting" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
          </button>
          <button className='titleBar-extendBtn group'>
            {/* <HelpOutline /> */}
            <img src={iconBtnHelp} alt=" Help" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
          </button>
        </div>
        <div className='w-32 min-w-32'></div>
        {/* //!必须加min-w-32不然按钮会和控制控件重叠 */}
      </div>
    </>
  )
}


