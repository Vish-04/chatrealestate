'use client'
// ** React Imports
import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box';
import { Button, Typography, Tooltip, Drawer } from '@mui/material'; 
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

// ** Icon Imports
import { IconX } from '@tabler/icons-react'; 

// ** Auth Imports


const LoginPopupModal = ({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) => {
    const theme = useTheme();

    return (
            <Drawer onClick={(e)=>e.stopPropagation()} onClose={() => setOpen(false)} open={open} anchor='right' className={`items-center justify-center flex`}>
                <Box className='relative flex flex-col items-center justify-center'>
                    <Box className='absolute top-2 right-2 cursor-pointer' onClick={() => setOpen(false)}>
                        <IconX size={24} stroke={1.5} className='text-white' />
                    </Box>
                    <Typography variant='h6'>Login</Typography>
                    <Typography variant='subtitle1' color={theme.palette.text.secondary} >Login to continue</Typography>
                    <Button onClick={(e) => {
                        e.stopPropagation()
                    }}>Sign in with Google</Button>    
                </Box>
        </Drawer>
    )
}

export default LoginPopupModal