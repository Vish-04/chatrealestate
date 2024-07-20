// ** Next Imports
import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Message from './message/Message'

// ** Type Imports
import { ChatHistoryType } from '@/utils/types'

// ** Custom Components Imports
import SpinnerComponent from '../common/CustomSpinner'

type ChatWindowProps = {
  chatHistory: ChatHistoryType
  loading: boolean
}

const ChatWindow = ({chatHistory, loading}: ChatWindowProps) => {
  
  return (
    <Box className='w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center'>
      <Box className='w-[64%] h-full px-4 py-3'>
        {chatHistory.messages?.L.map((chat, index) => (
          <Message key={`${chat.M?.role.S}-${index}`} message={chat} componentType={chat.M?.componentProps?.M.componentType.S} />
        ))}
      {loading && <SpinnerComponent />}
        

      </Box>
    </Box>
  )
}

export default ChatWindow