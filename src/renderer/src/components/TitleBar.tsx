import { useEffect, useState } from 'react'
import '../../main.css'
// !还得在每个组件里面都要导入一次吗………………
import icon from '../../../../resources/Icon.png'
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
  return (
    <div className="w-full h-8 fixed top-0 left-0 flex items-center text-sm border-b-2">
      <img src={icon} alt="NROR" className='w-5 h-5' />
      {/* <img src={path.join(__dirname, "../resources/Icon.png")} alt="NROR" />用什么path.join………… */}
      <span className='ml-1'>当前目录:{curDir}</span>
      <button className='h-fit ml-3 px-2 py-[2px] bg-gray-400 rounded-md'>更改</button>
      <button className='w-8 h-8 hover: bg-gray-200'></button>
      <button className='w-8 h-8 hover: bg-gray-200'></button>
      <button className='w-8 h-8 hover: bg-gray-200'></button>
      <button className='w-8 h-8 hover: bg-gray-200'></button>
      <button className='w-8 h-8 hover: bg-gray-200'></button>
    </div>
  )
}
// @ts-ignore


