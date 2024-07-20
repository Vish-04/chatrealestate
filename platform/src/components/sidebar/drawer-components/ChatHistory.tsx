// ** Next Imports
import React, { useEffect, useState } from 'react'

// ** Type Imports 
import { UserType, UserPreferencesType } from '@/utils/types'

// ** MUI Imports
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// ** Auth Imports
import { useUser } from '@auth0/nextjs-auth0/client'

// ** Utils Imports
import { fetchUser } from '@/utils/db'

const ChatHistory = () => {
  const { user, isLoading } = useUser()
  const [userInfo, setUserInfo] = useState<[UserType, UserPreferencesType] | []>([])

  useEffect(() => {
    if (user?.email) {
      fetchUser({ email: user.email, setUserInfo })
    }
  }, [user?.email])


  return (
    <Box className="flex flex-col gap-2">
      {userInfo[0]?.chats?.L.map((chat) => (
        <Button href={`/chat/${chat.M.chat_id.S}`} key={chat.M.chat_id.S}>{chat.M.title.S}</Button>
      ))}
    </Box>
  )
}

export default ChatHistory