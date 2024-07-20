"use client"

// ** Next Imports
import {useState, useEffect} from 'react'
import { useParams, useSearchParams } from 'next/navigation';

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
import { chatStarter } from '@/utils/vars';

// ** UUID Imports
import { v4 as uuidv4 } from 'uuid';
import { createChat, fetchChatHistory, fetchUser, updateChatTable } from '@/utils/db';

const ChatPage = () => {

  // ** User States
  const {user, isLoading} = useUser();
  const [userInfo, setUserInfo] = useState<[UserType, UserPreferencesType] | []>([])

  const params = useParams();
  const chatId = (params.chatId || ['newChat']) as string[];
  const query = useSearchParams();

  // ** Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

  // Chat Message States
  const [inputValue, setInputValue] = useState<string>(query.get('initialMessage') || '')
  const [chatHistory, setChatHistory] = useState<ChatHistoryType>({
    chatId: {S: chatId[0] as string},
    email: {S: user?.email as string},
    messages: {L: [{M: chatStarter}]}
  })


  // Fetch user information from DB
  useEffect(() => {

    if (user?.email) {
      fetchUser({ email: user?.email, setUserInfo });
    }
  }, [user?.email])

  // Fetch Chat History
  useEffect(() => {
  
    if (chatId[0] !== 'newChat' && user?.email) {
      fetchChatHistory({ chatId: chatId, email: user?.email, setChatHistory });
    }

    // If the query has an initial message, handle the click
    if (query.get('initialMessage') && chatHistory.messages.L.length <= 2) {
      
      handleClick()
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [chatId[0], user?.email, query.get('initialMessage')]);

  // Drawer open/close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // If enter is clicked
  const handleClick = async () => {

    // If New chat
    if (chatId[0] === "newChat" && user?.email) {
      createChat({ email: user?.email as string, initialMessage: inputValue })
      // Normal handle click
    } else if(user) {
      const userInformation = {
        name: userInfo[0]?.name?.S,
        locations: userInfo[1]?.locations.L,
        budget: userInfo[1]?.budget.L,
        beds_baths: userInfo[1]?.beds_baths.L,
        size_of_house: userInfo[1]?.size_of_house.L,
        house_descriptions: userInfo[1]?.house_descriptions.L ,
        window_shopping: userInfo[1]?.window_shopping?.BOOL || undefined
      }
      
      // Update chat history first
      setChatHistory({
          ...chatHistory,
            messages: {L: [...chatHistory.messages.L, 
                { M: {role: {S: "user"}, content: {S: inputValue}}}
        ]}
      });
      // get response
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
      // Update chat history
      
      
      // actually update the table


    await updateChatTable({chatHistory: {
      ...chatHistory,
      messages: {L: [...chatHistory.messages.L, 
          { M: {role: {S: "user"}, content: {S: inputValue}}},
          { M: {role: {S: "assistant"}, content: {S: data.content}, componentProps: {
              M: {componentType: {S: data.componentType}}
          }}
      } ]
  }}, setChatHistory, email: user?.email as string});

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
    // TODO: Function to update userInfo
  }

// Function to remove query parameters from the URL without reloading the page
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
      {chatHistory.messages.L.length === 1 ? 
        <Chatbox 
          drawerOpen={drawerOpen} 
          setInputValue={setInputValue} 
          inputValue={inputValue} 
          handleClick={handleClick}
        />
      : 
        <ChatInterface 
          key={JSON.stringify(chatHistory)}
          drawerOpen={drawerOpen} 
          setInputValue={setInputValue} 
          inputValue={inputValue} 
          chatHistory={chatHistory}
          handleClick={handleClick}
        />
      }

      {/* CHAT INTERFACE */}
      
    </Box> : <>
    Loading...
    </>
  )
}

export default ChatPage;