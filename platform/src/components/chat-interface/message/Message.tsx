// ** Next Imports
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// ** MUI Imports
import { Box, Typography } from '@mui/material'

// ** Type Imports
import { MessageType } from '@/utils/types'

// ** Style Imports
import { useTheme } from '@mui/material/styles'

// ** Custom Imports
import ChatSlider from '@/components/chat-interface/message/message-components/ChatSlider'
import ChatBoolean from '@/components/chat-interface/message/message-components/ChatBoolean'

const Message = ({ message, componentType }: { message: MessageType, componentType: string | undefined }) => {
  const isAssistant = message.M?.role?.S === 'assistant';
  const [sliderValue, setSliderValue] = useState<number[]>([0, 5000000])
  const [buttonValue, setButtonValue] = useState<boolean | null>(null)
  const handleButtonClick = (button: boolean) => {
    setButtonValue(button)
  }

  const theme = useTheme()

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [message]);

  if (isAssistant) {
    return (
        <Box className="flex flex-col">
          <Box className="flex flex-col mr-10">
            {/* <Image 
              src="/logo.png" 
              alt="Profile Picture" 
              width={50} 
              height={50} 
              style={{ borderRadius: '50%' }} 
              /> */}
            <Typography fontSize={16} className='text-white' mb={1}>Dream<span className="bg-gradient-to-r from-purple-400 via-pink-500 fade-in-on-scroll to-red-500 text-transparent bg-clip-text">RE</span></Typography>
            <Typography fontSize={16} color='text.secondary'>{message.M?.content?.S}</Typography>
            {componentType === 'budget' && <ChatSlider value={sliderValue} setValue={setSliderValue} />}
            {componentType === 'boolean' && 
              <ChatBoolean buttonOneText="I'm just window shopping!" buttonTwoText='I want to buy a home!' onButtonClick={handleButtonClick} selected={buttonValue} />
            }
          </Box>
          <div ref={chatEndRef} className='bg-red-500'></div>
        </Box>
    )
  } else if(message.M?.role?.S === 'user') {
      return (
        <Box className="items-end flex-col flex">
            {/* <Box 
              width={50} 
              height={50} 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              className="rounded-full fade-down flex items-center justify-center bg-gradient-to-r border border-black from-purple-400 via-pink-500 to-red-500  outline-white"
              >
              <Typography variant="h6" color="text.primary">
                GU
              </Typography>
            </Box> */}
            <Box className='px-4 py-2' sx={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
              <Typography fontSize={16} color='text.primary'>{message.M?.content?.S}</Typography>
            </Box>
        </Box>
      )
  }

}

export default Message