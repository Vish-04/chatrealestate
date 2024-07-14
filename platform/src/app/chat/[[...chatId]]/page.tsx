"use client"

// ** Next Imports
import React from 'react'
import { useParams } from 'next/navigation';
import { Box } from '@mui/material';
import SideBar from '@/components/sidebar/Sidebar';
import PersistentDrawer from '@/components/sidebar/PersistentDrawer';
import Chatbox from '@/components/chatbox/Chatbox';

const ChatPage = () => {
  const params = useParams();
  const slug = params.chatId || '';

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerContent, setDrawerContent] = React.useState<React.ReactNode>(null);

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
      <Chatbox drawerOpen={drawerOpen} />
    </Box>
  )
}

export default ChatPage;