// ** Next Imports
import { useState } from 'react'
import Image from 'next/image'

// ** MUI Imports
import { Box, Typography } from '@mui/material'

// ** Type Imports
import { MessageType } from '@/utils/types'


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

  if (isAssistant) {
    return (
        <Box className="flex flex-col">

          <Box className="flex flex-col">
            <Image 
              src="/logo.png" 
              alt="Profile Picture" 
              width={50} 
              height={50} 
              style={{ borderRadius: '50%' }} 
              />
            <Typography>{message.M?.content?.S}</Typography>
            {componentType === 'budget' && <ChatSlider value={sliderValue} setValue={setSliderValue} />}
            {componentType === 'boolean' && 
              <ChatBoolean buttonOneText="I'm just window shopping!" buttonTwoText='I want to buy a home!' onButtonClick={handleButtonClick} selected={buttonValue} />
            }
          </Box>
        </Box>
    )
  } else if(message.M?.role?.S === 'user') {
      return (
        <Box className="items-end flex-col flex">
            <Box 
              width={50} 
              height={50} 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              className="rounded-full flex items-center justify-center bg-gradient-to-r border border-black from-purple-400 via-pink-500 to-red-500  outline-white"
              >
              <Typography variant="h6" color="text.primary">
                GU
              </Typography>
            </Box>
            <Typography>{message.M?.content?.S}</Typography>
        </Box>
      )
  }

}

export default Message