'use client'

// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import { Button, Typography, Tooltip, TextField, Popover, Popper, ClickAwayListener } from '@mui/material'; 
import { useTheme } from '@mui/material/styles';

// ** Type Imports
import { SidebarType } from '@/utils/types';

// ** Icons Imports
import { IconEdit, IconMessageCircle, IconSend } from '@tabler/icons-react'; 

// ** Custom Imports
import HorizontalScroller from '@/components/chatbox/HorizontalScroller';

// ** Auth
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, isLoading } = useUser()
  const [inputValue, setInputValue] = useState<string>('');

  const handleClick = (event: any) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();

  const sidebar: SidebarType[] = [
    { icon: <IconEdit size={27} stroke={1.5} className='text-[#6f6f6f] hover:text-white transition-colors ease-in-out duration-300 m-2' />, title: 'New Chat', onClick: (e)=>{
      handleClick(e)
    } }, 
    { icon: <IconMessageCircle size={27} stroke={1.5} className='text-[#6f6f6f] hover:text-white transition-colors ease-in-out duration-300 m-2' />, title: 'Chat History', onClick: (e)=>handleClick(e) }, 
  ]

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  if(!isLoading && user) {
    window.location.href = '/chat';
  } else {
    return (
      <Box className="flex w-[100vw] h-[100vh] overflow-hidden flex-row bg-black">
        {/* SIDEBAR  */}
        <Box className="w-[67px] h-[100vh] border-r bg-[#111111] border-[#3a3939] transition-all overflow-x-hidden flex flex-col items-center pt-4">
          
          {/* Profile */}
          <Box className="w-[40px] h-[40px] mb-5 rounded-full flex items-center justify-center bg-gradient-to-r outline from-purple-400 via-pink-500 to-red-500 border border-black hover:outline hover:outline-3 hover:outline-white transition-all duration-300 cursor-pointer">
            <Tooltip title="Guest User" placement="right">
              <Typography variant="h6" className="text-white">
                GU
              </Typography>
            </Tooltip>
          </Box>
  
          {/* BUTTON MAP */}
          {sidebar.map((item, index) => (
            <Tooltip title={item.title} placement="right" key={index}>
              <Button onClick={(e)=>item.onClick(e)} sx={{padding: 0, minWidth: 0}} size='small' color='secondary' className=" mx-2 mb-2 rounded-md flex items-center justify-center border border-white/50">
                {item.icon}
              </Button>
            </Tooltip>
          ))}
        </Box>
  
        {/* MAIN BODY */}
        <Box className="w-[calc(100vw-67px)] h-[100vh] p-4 relative flex flex-col items-center transition-all duration-500 text-center justify-between">
          {/* Sign In and Sign Up Buttons */}
          <Box className="absolute top-0 right-0 mt-4 mr-4 flex gap-2">
              <Button
                href='/api/auth/login'
                variant="outlined"
                className="text-white rounded-md"
                sx={{
                  border: '2px solid',
                  borderRadius: '30px',
                  borderImage: 'linear-gradient(to right, #a855f7, #ec4899, #ef4444) 1',
                  color: 'white',
                  '&:hover': {
                    opacity: 0.9,
                    borderRadius: '30px',
                    border: '2px solid',
                    borderImage: 'linear-gradient(to right, #a855f7, #ec4899, #ef4444) 1',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                href='/api/auth/login' 
                variant="outlined"
                sx={{border: '2px solid', "&:hover": {border: '2px solid'}}}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 fade-in-on-scroll to-red-500 text-transparent font-semibold bg-clip-text">Sign Up</span>
              </Button>
          </Box>
  
          <Typography variant='h5' className={`text-[white] font-bold absolute top-0 left-0 mt-4 ml-4`}>
            Dream<span className="bg-gradient-to-r from-purple-400 via-pink-500 fade-in-on-scroll to-red-500 text-transparent bg-clip-text">RE</span> 
          </Typography>
          
          <Box className='w-full flex flex-col items-center justify-center fade-in-on-scroll mt-8'>
              <Typography variant='h2' className={`text-[white] font-bold fade-in-on-scroll mb-2`}>
              Finding Your <span className="bg-gradient-to-r from-purple-400 via-pink-500 fade-in-on-scroll to-red-500 text-transparent bg-clip-text">Dream </span> House
            </Typography>
            <Typography className={`text-[white]/70 fade-in-on-scroll text-2xl mb-4`}>
              Chat with Properties and Rentals Across California
            </Typography>
          </Box>
  
          <HorizontalScroller setInputValue={setInputValue} />
  
          {/* CALL TO ACTION + TITLES */}
  
          {/* FAKE INPUT */}
          <Box className='w-[64%] px-4 py-3'>
              <form onSubmit={handleClick}>
              <Box id='finput' className='w-full flex flex-row items-center justify-between gap-2 fade-in-on-scroll cursor-pointer border mb-14 mt-10  rounded-md transition-all ease-in-out duration-300 ' >
  
              <TextField variant='outlined' color='secondary' fullWidth autoComplete='false' placeholder='Start Typing...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              InputProps={{
                endAdornment: <IconSend type='submit' size={30} stroke={2} className='text-[white] mr-2 hover:cursor-pointer hover:text-pink-500 transition-all ease-in-out duration-300' onClick={handleClick} />,
                style: { border: 'none', boxShadow: 'none' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
              >
                Get Started!!
              </TextField>
              </Box>
            </form>
            </Box>
            <ClickAwayListener onClickAway={(e) => {
              if (  anchorEl && !anchorEl.contains(e.target as Node)) {
                handleClose();
              }
            }}>
              <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement='top'
              >
                <Box p={2} className={`flex flex-col justify-center items-center border border-[${theme.palette.text.secondary}] bg-[#121212] rounded-md z-[100]`}>
                  <Typography variant="h6" className="text-center" color="text.secondary">
                    Log In to use this feature
                  </Typography>
                  <Box className='flex flex-col items-center justify-center mt-1 w-full'>
                      <Button
                        variant="outlined"
                        color="info"
                        className='group'
                        fullWidth 
                        href='/api/auth/login'
                      >
                        <Typography variant="subtitle2" color="text.primary">
                          Log In
                        </Typography>
                      </Button>
                    <Box className='w-[80%] gap-2 flex items-center justify-center mt-1 mb-1'>
                      <Box width="60%" borderBottom={`1px solid ${theme.palette.info.main}`} />
                      <Typography variant="subtitle2" className="text-center" color="text.secondary">
                        Or
                      </Typography>
                      <Box width="60%" borderBottom={`1px solid ${theme.palette.info.main}`} />
                    </Box>
                      <Button variant="contained" color="info" className="mb-2" fullWidth
                      href='/api/auth/login'
                      >
                        <Typography variant="subtitle2" color="black">
                          Sign Up
                        </Typography>
                      </Button>
                  </Box>
                </Box>
              </Popper>
            </ClickAwayListener>
  
            {/* FOOTER */}
          <Box className="absolute bottom-0 left-0 w-full p-4 bg-transparent">
            <Typography variant='body2' className="text-[white]/50 text-left">
              Made with <span className="text-red-500">❤️</span> by Vish and Nitin
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
}
