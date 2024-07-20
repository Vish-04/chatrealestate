// ** Next Imports
import React, { useEffect, useState } from 'react'

// ** Type Imports 
import { UserType, UserPreferencesType } from '@/utils/types'

// ** MUI Imports
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Tabler Icons
import { IconTrash } from '@tabler/icons-react'

// ** Auth Imports
import { useUser } from '@auth0/nextjs-auth0/client'

// ** Utils Imports
import { fetchUser, deleteChat } from '@/utils/db'
import SpinnerComponent from '@/components/common/CustomSpinner'

const ChatHistory = () => {
  const { user, isLoading } = useUser()
  const [userInfo, setUserInfo] = useState<[UserType, UserPreferencesType] | []>([])

  useEffect(() => {
    if (user?.email) {
      fetchUser({ email: user.email, setUserInfo })
    }
  }, [user?.email])

  const handleDelete = (chatId:string) => {
    // Implement the delete functionality here
    if(user?.email){
      deleteChat(chatId, user?.email)
      fetchUser({ email: user.email, setUserInfo })
    }
  }
  

  return (
    <Box className="flex flex-col gap-2 text-left">
      {userInfo[0] ? userInfo[0]?.chats?.L.map((chat) => (
        <Box key={chat.M.chat_id.S} className='flex flex-row justify-between'>
          <Button className='text-left flex flex-row items-start' href={`/chat/${chat.M.chat_id.S}`}>
            <Typography className='text-left' variant='subtitle2'>
              {chat.M.title.S.length < 50 ? chat.M.title.S.substring(0, 20) + '...' : chat.M.title.S}
            </Typography>
          </Button>
          <IconButton onClick={() => handleDelete(chat.M.chat_id.S)}>
            <IconTrash className='text-white hover:text-red-500 transition-colors ease-in-out duration-300' strokeWidth={1.5} />
          </IconButton>
        </Box>
      )) : <SpinnerComponent />}
    </Box>
  )
}

export default ChatHistory