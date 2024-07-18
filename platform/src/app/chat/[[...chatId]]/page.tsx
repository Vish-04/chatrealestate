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
import ChatInterface from '@/components/chat-interface/ChatInterface';


const ChatPage = () => {

  const {user, isLoading} = useUser();

  const params = useParams();
  const chatId = params.chatId || 'newChat';

  console.log("CHAT ID", chatId)

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

  const [inputValue, setInputValue] = useState<string>('')

  const [userInfo, setUserInfo] = useState<[UserType, UserPreferencesType] | []>([])

  const [chatHistory, setChatHistory] = useState<ChatHistoryType>({
    chatId: chatId as string,
    messages: [{role: "system", content: "You are an ai real estate agent who is helping users find the perfect home. You are also a helpful assistant that can help users with their questions. Answer professionally and in 1-2 sentences. Additionally use any and all of the data about the user provided to you to help make ur descision"}]
  })

  useEffect(() => {
    const fetchUser = async () =>{
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        body: JSON.stringify({ email: user?.email }),
      });

      if (response.status !== 200) {
        window.location.href = "/api/auth/login"
      }

      const data = await response.json();
      console.log("USER INFODATA", data)
      setUserInfo(data);
    }

    if (user?.email) {
      fetchUser();
    } else {
    }

  }, [user?.email])

  // TODO:
  // Function to get chat information from DB
  // Function to get chatstatus from DB

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleClick = async () => {

    if (chatId === "newChat") {
      // TODO: Create endpoint that does the following
      // Add chat to user
      // Create new chat object with system prompt, chat id, and initial response
      setChatHistory({
        chatId: chatId as string,
        messages: [{role: "system", content: "You are an ai real estate agent who is helping users find the perfect home. You are also a helpful assistant that can help users with their questions. Answer professionally and in 1-2 sentences. Additionally use any and all of the data about the user provided to you to help make ur descision"}]
      })
    }

    const userInformation = {
      name: userInfo[0]?.name?.S,
      locations: userInfo[1]?.locations.L,
      budget: userInfo[1]?.budget.L,
      beds_baths: userInfo[1]?.beds_baths.L,
      size_of_house: userInfo[1]?.size_of_house.L,
      house_descriptions: userInfo[1]?.house_descriptions.L ,
      window_shopping: userInfo[1]?.window_shopping?.BOOL || undefined
    }

    console.log("USER INFO", userInformation)
    setChatHistory({
        ...chatHistory,
        messages: [...chatHistory.messages, 
            { role: "user", content: inputValue}
        ]
    });
    const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            prompt: inputValue, 
            chatHistory: chatHistory, 
            userInfo: userInformation
        })
    })

    const data = await response.json()
    setChatHistory({
        ...chatHistory,
        messages: [...chatHistory.messages, 
            { role: "user", content: inputValue},
            { role: "assistant", content: data.content, componentProps: {
                componentType: data.componentType
            }
        } ]
    });


    // Update userInfo with matching fields from data.updatedUserInfo
    if (data.updatedUserInfo) {
        setUserInfo(prevUserInfo => {
            if (prevUserInfo.length === 0) {
                return [data.updatedUserInfo, {} as UserPreferencesType];
            }
            return [prevUserInfo[0], {...prevUserInfo[1], ...data.updatedUserInfo}];
        });
    }
    console.log("What would have been updated",  [userInfo[0], {...userInfo[1], ...data.updatedUserInfo}])
}

  return (
    userInfo.length > 0 ? 
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
      {chatHistory.messages.length === 1 ? 
        <Chatbox 
          drawerOpen={drawerOpen} 
          setInputValue={setInputValue} 
          inputValue={inputValue} 
          handleClick={handleClick}
        />
      : 
        <ChatInterface 
          drawerOpen={drawerOpen} 
          setInputValue={setInputValue} 
          inputValue={inputValue} 
          chatHistory={chatHistory}
          handleClick={handleClick}
        />
      }

      {/* CHAT INTERFACE */}
      
    </Box> : <>
    Loading...</>
  )
}

export default ChatPage;