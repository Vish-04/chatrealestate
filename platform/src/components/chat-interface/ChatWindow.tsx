// ** Next Imports
import {useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Message from './message/Message'

// ** Custom Components Imports
import ChatSlider from './message/message-components/ChatSlider'
import ChatBoolean from './message/message-components/ChatBoolean'
import { ChatHistoryType, MessageType } from '@/utils/types'

type ChatWindowProps = {
  chatHistory: ChatHistoryType
}

const ChatWindow = ({chatHistory}: ChatWindowProps) => {
  
  console.log(chatHistory)
  return (
    <Box className='w-[64%] h-full px-4 py-3 overflow-y-auto'>
      {chatHistory.messages?.map((chat) => (
        <Message message={{ role: chat.role, content: chat.content }} componentType={chat.componentProps?.componentType} />
      ))}
      

    </Box>
  )
}

export default ChatWindow