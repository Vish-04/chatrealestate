import React from 'react'
import { Box, Tooltip, Typography, Button } from '@mui/material'
import { sidebar } from './NavItems'

type SideBarProps = {
    setDrawerContent: (content: string) => void;
    setDrawerOpen: (open: boolean) => void;
}

const SideBar = ({ setDrawerContent, setDrawerOpen }: SideBarProps) => {
  const items = sidebar(setDrawerContent, setDrawerOpen);

  return (
    <Box className="w-[67px] h-[100vh] border-r bg-[#111111] border-[#3a3939]  overflow-x-hidden flex flex-col items-center pt-4" sx={{ zIndex: 2 }}>
          
        {/* Profile */}
        <Box 
            className="w-[40px] h-[40px] mb-5 rounded-full flex items-center justify-center bg-gradient-to-r outline outline-black from-purple-400 via-pink-500 to-red-500 border border-black hover:outline hover:outline-3 hover:outline-white transition-all duration-300 cursor-pointer"
            onClick={() => setDrawerOpen(false)}
        >
        <Tooltip title="Guest User" placement="right">
            <Typography variant="h6" className="text-white">
            GU
            </Typography>
        </Tooltip>
        </Box>

        {/* BUTTON MAP */}
        {items.map((item, index) => (
        <Tooltip title={item.title} placement="right" key={index}>
            <Button onClick={(e) => item.onClick(e)} sx={{padding: 0, minWidth: 0}} size='small' color='secondary' className=" mx-2 mb-2 rounded-md flex items-center justify-center border border-white/50">
            {item.icon}
            </Button>
        </Tooltip>
        ))}
    </Box>
  )
}

export default SideBar