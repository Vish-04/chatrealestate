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

const ChatPage = () => {

  // ** User States
  const {user, isLoading} = useUser();
  const [userInfo, setUserInfo] = useState<[UserType, UserPreferencesType] | []>([])

  const params = useParams();
  const chatId = params.chatId || 'newChat';
  const query = useSearchParams();
  console.log("CHAT ID", chatId)

  // ** Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

  // Chat Message States
  const [inputValue, setInputValue] = useState<string>(query.get('initialMessage') || '')
  const [chatHistory, setChatHistory] = useState<ChatHistoryType>({
    chatId: chatId as string,
    messages: [chatStarter]
  })
    

  // Fetch user information from DB
  useEffect(() => {
    const fetchUser = async () =>{
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        body: JSON.stringify({ email: user?.email }),
      });

      // If user is not logged in, redirect to login
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

  // CODE TO FETCH CHAT HISTORY
  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await fetch('/api/chat/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chat_uuid: chatId[0], email: user?.email })
      });

      if (response.status === 200) {
        const data = await response.json();
        setChatHistory({
          chatId: chatId as string,
          messages: data.messages.map((msg: any) => JSON.parse(msg.S))
        });
      } else {
        console.error('Error fetching chat history');
      }
    };

    if (chatId !== 'newChat' && user?.email) {
      fetchChatHistory();
    }
    if (query.get('initialMessage')) {
      handleClick()
    }
  }, [chatId, user?.email]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleClick = async () => {

    if (chatId === "newChat") {
      const chat_uuid = uuidv4();
      console.log("IN")
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        body: JSON.stringify({ email: user?.email, chat_uuid: chat_uuid, initialMessage: inputValue }),
      });
      setChatHistory({
        chatId: chatId as string,
        messages: [chatStarter, {role: "user", content: inputValue}]
      })

      if (response.status !== 200) {
        console.log("Error creating chat")
      } else {
        window.location.href = `/chat/${chat_uuid}`;
      }
    } else {

      
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
      
            const updateChatTable = async (chatHistory: ChatHistoryType) => {
              try {
                const response = await fetch('/api/chat/update', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    chatObject: {
                      chatId: chatHistory.chatId,
                      messages: chatHistory.messages,
                    },
                    email: user?.email,
                  }),
                });
      
                if (response.status !== 200) {
                  console.error('Error updating chat table');
                } else {
                  console.log('Chat table updated successfully');
                }
              } catch (error) {
                console.error('Error updating chat table:', error);
              }
          };
      
          await updateChatTable({
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
// Function to remove query parameters from the URL without reloading the page
const removeQueryParameters = () => {
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, document.title, url.toString());
};

// Call the function to remove query parameters
removeQueryParameters();
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