import '../../main.css'
import icon from '../../../../resources/Icon.png'
import iconBtnRefresh from '../../../../resources/btn-refresh.png'
import iconBtnSetting from '../../../../resources/btn-setting.png'
import iconBtnHelp from '../../../../resources/btn-help.png'
import { Tooltip, Zoom } from '@mui/material'

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
        <span id='titlebar-curDir' className='ml-1 overflow-hidden text-ellipsis whitespace-nowrap' onContextMenu={_e => window.electron.ipcRenderer.send('contextmenu-cur-dir')}>当前目录:{curDir}</span>
        <Tooltip title='更改所需要整理的目录' TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} enterDelay={500}>
          <button className='h-5 ml-3 px-3 py-[2px] rounded-md bg-gray-300 transition-all shadow-md text-nowrap hover:scale-110 active:bg-gray-400 active:scale-90 ' onClick={() => { window.electron.ipcRenderer.send('request-change-cur-dir') }}>更改</button>
        </Tooltip>
        <div className="dragZone min-w-8"></div>
        <div className="titleBar-extendBtn-region">
          <Tooltip title='刷新' TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} enterDelay={500}>
            <button id='btn-refresh' className='titleBar-extendBtn group' onClick={() => { (document.getElementById('btn-refresh') as HTMLButtonElement).children[0].classList.add('rotate'); window.electron.ipcRenderer.send('request-update-record-data') }}>
              <img src={iconBtnRefresh} alt="Refresh" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
            </button>
          </Tooltip>
          <Tooltip title='设置' TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} enterDelay={500}  >
            <button id='btn-setting' className='titleBar-extendBtn group' onClick={() => { window.electron.ipcRenderer.send('open-settings') }} >
              <img src={iconBtnSetting} alt="Setting" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
            </button>
          </Tooltip>
          <Tooltip title='帮助' TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} enterDelay={500}  >
            <button className='titleBar-extendBtn group'>
              <img src={iconBtnHelp} alt=" Help" draggable='false' className='mx-auto transition-all group-hover:scale-110 group-active:scale-90' />
            </button>
          </Tooltip>
        </div>
        <div className='w-32 min-w-32'></div>
      </div>
    </>
  )
}


