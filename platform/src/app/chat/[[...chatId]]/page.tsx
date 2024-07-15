"use client"

// ** Next Imports
import {useState, useEffect} from 'react'
import { useParams } from 'next/navigation';

// ** MUI Imports
import  Box from '@mui/material/Box';

// ** Custom Imports
import SideBar from '@/components/sidebar/Sidebar';
import PersistentDrawer from '@/components/sidebar/PersistentDrawer';
import Chatbox from '@/components/chatbox/Chatbox';

// ** Type Imports
import { ChatHistoryType, UserType, UserPreferencesType } from '@/utils/types';

// ** Auth Imports
import { useUser } from '@auth0/nextjs-auth0/client';


const ChatPage = () => {

  const {user, isLoading} = useUser();

  const params = useParams();
  const chatId = params.chatId || 'newChat';

  // TODO: useState to for chatstatus
  const chatStatus = "collectInfo"

  useEffect(() => {
    const fetchUser = async () =>{
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await response.json();
      console.log(data)
      setUserInfo([data, data]);
    }

    if (user?.email) {
      fetchUser();
    }

  }, [user?.email])

  console.log(chatId)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

  const [inputValue, setInputValue] = useState<string>('')

  const [userInfo, setUserInfo] = useState<[UserType, UserPreferencesType] | []>([])

  // TODO: useState to for chatHistory
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([])

  // TODO:
  // Function to get chat information from DB
  // Function to get chatstatus from DB

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box className="flex w-[100vw] h-[100vh] overflow-hidden flex-row bg-black relative">
      <SideBar 
        setDrawerContent={setDrawerContent} 
        setDrawerOpen={setDrawerOpen} 
      />

      <PersistentDrawer 
        open={drawerOpen} 
        handleDrawerClose={handleDrawerClose} 
        content={drawerContent} 
      />   

      {/* CHAT BOX */}
      <Chatbox drawerOpen={drawerOpen} setInputValue={setInputValue} inputValue={inputValue} />

      {/* CHAT INTERFACE */}

    </Box>
  )
}

export default ChatPage;