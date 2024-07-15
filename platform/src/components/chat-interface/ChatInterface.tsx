// ** Next Imports
import { useState } from 'react'


// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { IconSend } from '@tabler/icons-react'

type ChatInterfaceProps = {
    drawerOpen: boolean
    setInputValue: (value: string) => void
    inputValue: string
  }
const ChatInterface = ({drawerOpen, setInputValue, inputValue}: ChatInterfaceProps) => {

    const handleClick = () => {
        console.log(inputValue)
    }

  return (
    <Box className={` h-[100vh] p-4 relative flex flex-col items-center text-center justify-between ${drawerOpen ? 'w-[calc(100vw-300px-67px)]' : 'w-[calc(100vw-67px)]'}`}>
        
        <Box className='w-[64%] px-4 py-3'>
              <Box id='finput' className='w-full flex flex-row items-center justify-between gap-2 fade-in-on-scroll cursor-pointer border mb-14 mt-10  rounded-md transition-all ease-in-out duration-300 ' >
  
                <TextField 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                    variant='outlined' 
                    color='secondary' 
                    fullWidth 
                    autoComplete='false' 
                    placeholder='Start Typing...'
                    InputProps={{
                        endAdornment: <IconSend size={30} stroke={2} className='text-[white] mr-2 hover:cursor-pointer hover:text-pink-500 transition-all ease-in-out duration-300' onClick={handleClick} />,
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
        </Box>
    </Box>
  )
}

export default ChatInterface