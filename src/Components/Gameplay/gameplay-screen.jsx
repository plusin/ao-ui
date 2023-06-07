import { DragDropProvider } from '../Common/DragDropProvider'
import { DragLayer } from '../Common/DragLayer/drag-layer'
import Chat from './Chat/chat'
import './gameplay-screen.scss'
import MiniMap from './MiniMap/mini-map'
import SideMenu from './SideMenu/side-menu'
import TopBar from './TopBar/top-bar'

export default function GameplayScreen() {
  return (
    <div className='gameplay-screen'>
      <TopBar styles='top-bar'/>
      <div className='gameplay-area'>
      <DragDropProvider>
      <span className='menu-separator'><span className='frame-corner bot-left'></span></span>
        <div className='gameplay-and-chat'>
          <div className='chat-section'>
            <Chat/>
            <MiniMap/>
          </div>
          <div className='gameplay-window'></div>
          <span className='gameplay-bottom-frame'></span>
        </div>
        <span className='menu-separator'><span className='frame-corner bot-right'></span></span>
        <SideMenu styles='right-panel'/>
        <DragLayer/>
        </DragDropProvider>
      </div>
    </div>
  )
}
