import { useEffect, useRef, useState } from 'react'
import { ChatPrefix, ChatStates } from '../../../constants'
import AoInput from '../../Common/ao-input/ao-input'
import { ChatOptions } from './ChatOptions'
import { selectChatMode, selectForceOpenChat, selectWhisperTarget, setWhisperTarget, setChatMode, openChat, safeOpenChat } from '../../../redux/GameplaySlices/ChatSlice'
import { RegisterApiCallback } from '../../../Api/Api'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setGameActiveDialog } from '../../../redux/GameplaySlices/GameStateSlice'
import { replaceAll } from '../../../Tools/Utils'

const GetChatPrefix = (type, targetUser) => {
  if (type === ChatStates.Normal) return ''
  if (type === ChatStates.Private) {
    return ChatPrefix[type] + targetUser + " "
  }
  return ChatPrefix[type] + " "
}

const GetChatState = message => {
  const capsMessage = message.toUpperCase()
  let ret = 0
  let targetChar = ''
  for(let i = 1; i < ChatPrefix.length; i++) {
    if (capsMessage.startsWith(ChatPrefix[i])){
      ret = i
      break;
    }
  }
  if (ret === ChatStates.Private) {
    targetChar = message.substring(1, message.indexOf(" "))
  }
  return [ret, targetChar]
}

export const ChatInput = ({forceOpenChatId}) => {

  const [chatState, setChatState] = useState({
    chatInput:'', lastOpenChatId:0
  });
  const [displayChatOpt, setDisplayChatOpt] = useState(false)
  const {chatInput} = chatState;
  const chatMode = useSelector(selectChatMode)
  const whisperTarget = useSelector(selectWhisperTarget)
  
  const handleChange = event => {
    const { value, name } = event.target;
    setChatState({ ...chatState, [name]: value});
  }
  const chatInputElement = useRef(null);
  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      window.parent.BabelUI.SendChat(chatInput)
      const [chatType, targetChar] = GetChatState(chatInput)
      console.log("got chat state:" + chatType + ", " + targetChar)

      dispatch(setWhisperTarget({target:targetChar, openChat: false}))
      dispatch(setChatMode(chatType))
      setChatState({ ...chatState, chatInput:''});
      chatInputElement.current.blur();
    }
  };  
  
  const handleGlobalKeyPress = evt => {
    if (evt.key === 'Enter' &&
        document.activeElement !== chatInputElement.current) {
          window.parent.APicallbacks.OpenChat(0)
    }
    if (evt.key === ' ' &&
        document.activeElement !== chatInputElement.current) {
          window.parent.BabelUI.FakeHitEvent()
    }
    if (evt.key === '-' &&
        document.activeElement !== chatInputElement.current) {
          window.parent.BabelUI.SetInventory()
    }
  }
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.addEventListener("keyup", handleGlobalKeyPress);
    }
    RegisterApiCallback('OpenChat', (ignoreValue) => { 
      dispatch(safeOpenChat())
    })
  },[]);
  useEffect( () => () => {
    if (process.env.NODE_ENV === 'development') {
      window.removeEventListener("keyup", handleGlobalKeyPress);
    }
    RegisterApiCallback('OpenChat', (chatMode) => {})
  }, [] );
  const onFocus = evt => {
    console.log("on focu chat")
    evt.currentTarget.setSelectionRange(evt.currentTarget.value.length, evt.currentTarget.value.length)
    window.parent.BabelUI.UpdateInputFocus(true)
  }
  const onBlur = evt => {
    window.parent.BabelUI.UpdateInputFocus(false)
  }
  const openChatOptions = evt => {
    console.log("open chat opt")
    setDisplayChatOpt(true)
  }

  if (forceOpenChatId > chatState.lastOpenChatId) {
    chatInputElement.current && chatInputElement.current.focus()
    const nextChat =  GetChatPrefix(chatMode, whisperTarget)
    console.log("open with next chat: " + nextChat)
    setChatState({ ...chatState, chatInput:nextChat, lastOpenChatId:forceOpenChatId});
    chatInputElement.current &&  chatInputElement.current.focus()
  }

  const { t } = useTranslation();
  const dispatch = useDispatch()
  const requestPrivateMessage = {
    popUp:'single-input-dialog',
    text: t('send-private-message'),
    onCancel: evt => {
      dispatch(setGameActiveDialog(null))
    },
    onAccept: targetName => {
      targetName = replaceAll(targetName, ' ', '+')
      const nextChat =  GetChatPrefix(ChatStates.Private,targetName)
      setChatState({ ...chatState, chatInput:nextChat, chatMode: ChatStates.Private});
      dispatch(setGameActiveDialog(null))
      chatInputElement.current &&  chatInputElement.current.focus()
    }
  }
  

  const selectChatOpt = option => {
    setDisplayChatOpt(false)
    console.log("got select chat option " + option)
    if (option === ChatStates.Private) {
      dispatch(setGameActiveDialog(requestPrivateMessage))
    } else {
      const nextChat =  GetChatPrefix(option,'')
      setChatState({ ...chatState, chatInput:nextChat, chatMode: option});
      chatInputElement.current &&  chatInputElement.current.focus()
    }
  }
  console.log("render with chat: " + chatInput + " mode " + chatMode + " and whisper: " + whisperTarget + " chat id: " + forceOpenChatId)
  return (
    <div className='input-line'>
        <img src={require('../../../assets/Icons/gameplay/ico_dialog.png')} 
          onClick={openChatOptions}
          className='chat-input-selection'/>
        <AoInput styles='chat-input' inputStyles='chat-input-area' 
                  name="chatInput" value={chatInput} IsValid={chatInput} 
                  required handleChange={handleChange} 
                  innerRef={chatInputElement}
                  onKeyUp={handleKeyUp}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  />
        <div className='chat-display-options'>
          <p className='option'>INFO</p>
          <p className='option'>GLOBAL</p>
        </div>
        {
          displayChatOpt ? 
          <ChatOptions selectOptions={selectChatOpt} currentOption={chatMode} />
          : null
        }
      </div>
  )
}