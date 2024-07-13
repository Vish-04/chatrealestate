'use client'

import '../styles/animations.css';
import Box from '@mui/material/Box';
import { Button, Typography, Tooltip } from '@mui/material'; 
import { IconEdit, IconMessageCircle, IconSend } from '@tabler/icons-react'; 
import TextField from '@mui/material/TextField';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import Listing from '../components/Listing';

type SidebarType = {
  icon: React.ReactNode,
  title: string,
}

type ListingType = {
  image: string,
  address: string,
  price: string,
  bedrooms: string,
  bathrooms: string,
  sqft: string
}


export default function Home() {

  const sidebar: SidebarType[] = [
    { icon: <IconEdit size={27} stroke={1.5} className='text-[#6f6f6f] hover:text-white transition-colors ease-in-out duration-300 m-2' />, title: 'New Chat' }, 
    { icon: <IconMessageCircle size={27} stroke={1.5} className='text-[#6f6f6f] hover:text-white transition-colors ease-in-out duration-300 m-2' />, title: 'Chat History' }, 
  ]

  const examplePromptsOne = [
    "Cheap homes in Folsom",
    "4-bed in Sacramento",
    "Newest in Roseville",
    "Pools in El Dorado",
    "3+ baths in Rocklin",
    "Garages in Granite Bay",
  ]

  const examplePromptsTwo = [
    "Davis homes under $500k",
    "Citrus Heights 3-bed",
    "Auburn new listings",
    "Fair Oaks townhouses",
    "Rancho Cordova villas",
    "Placerville cottages"
  ]

  const exampleListings: ListingType[] = [
    {
      image: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/11/5e3707aa-bd89-49bd-927f-ebc6679955fa.jpg',
      address: '123 Main St, Folsom, CA',
      price: '$250,000',
      bedrooms: '5',
      bathrooms: '5',
      sqft: '4,500'
    },
    {
      image: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/10/436450f6-5f36-4527-a340-0ed455e0ba8e.jpg',
      address: '456 Elm St, Folsom, CA',
      price: '$320,000',
      bedrooms: '6',
      bathrooms: '6',
      sqft: '5,200'
    },
    {
      image: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/10/58b26077-e4cb-4605-8d1b-9242540a0d82.jpg',
      address: '789 Oak St, Folsom, CA',
      price: '$275,000',
      bedrooms: '5',
      bathrooms: '5',
      sqft: '4,900'
    },
    {
      image: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/10/c6ac2e8f-3fbe-4de6-84ce-088b95857d6e.jpg',
      address: '101 Maple St, Folsom, CA',
      price: '$300,000',
      bedrooms: '6',
      bathrooms: '6',
      sqft: '5,100'
    },
    {
      image: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/11/fca35bca-af04-4ed6-ac5c-2e35153e7b16.jpg',
      address: '202 Pine St, Folsom, CA',
      price: '$350,000',
      bedrooms: '5',
      bathrooms: '5',
      sqft: '6,500'
    },
    {
      image: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/11/44f8b9af-4ede-4ea5-9bfe-b86cf99f666a.jpg',
      address: '303 Birch St, Folsom, CA',
      price: '$280,000',
      bedrooms: '6',
      bathrooms: '6',
      sqft: '4,800'
    }
  ];


  return (
    <Box className="flex w-[100vw] h-[100vh] overflow-hidden flex-row bg-black">
      {/* SIDEBAR  */}
      <Box className="w-[67px] h-[100vh] border-r bg-[#111111] border-[#3a3939] transition-all overflow-x-hidden flex flex-col items-center pt-4">
        
        {/* Profile */}
        <Box className="w-[40px] h-[40px] mb-5 rounded-full flex items-center justify-center bg-gradient-to-r outline from-purple-400 via-pink-500 to-red-500 border border-black hover:outline hover:outline-3 hover:outline-white transition-all duration-300 cursor-pointer">
          <Typography variant="h6" className="text-white">
            VA
          </Typography>
        </Box>

        {/* BUTTON MAP */}
        {sidebar.map((item, index) => (
          <Tooltip title={item.title} placement="right" key={index}>
            <Button sx={{padding: 0, minWidth: 0}} size='small' color='secondary' className=" mx-2 mb-2 rounded-md flex items-center justify-center border border-white/50">
              {item.icon}
            </Button>
          </Tooltip>
        ))}
      </Box>

      {/* MAIN BODY */}
      <Box className="w-[calc(100vw-67px)] h-[100vh] p-4 relative flex flex-col items-center transition-all duration-500 text-center justify-between">
        <Typography variant='h5' className={`text-[white] font-bold absolute top-0 left-0 mt-4 ml-4`}>
          Dream<span className="bg-gradient-to-r from-purple-400 via-pink-500 fade-in-on-scroll to-red-500 text-transparent bg-clip-text">RE</span> 
        </Typography>
        
        <Box className='w-full flex flex-col items-center justify-center fade-in-on-scroll mt-8'>
          {/* <Typography variant='h2' className={`text-[white] font-extrabold fade-in-on-scroll`}>
            Chat<span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text fade-in-on-scroll">RE</span>
          </Typography> */}
            <Typography variant='h2' className={`text-[white] font-bold fade-in-on-scroll mb-2`}>
            Finding Your <span className="bg-gradient-to-r from-purple-400 via-pink-500 fade-in-on-scroll to-red-500 text-transparent bg-clip-text">Dream </span> House
          </Typography>
          <Typography className={`text-[white]/70 fade-in-on-scroll text-2xl mb-4`}>
            Chat with Properties and Rentals Across California
          </Typography>
        </Box>

        {/* HORIZONTAL SCROLLER */}
        <Box className='w-[64%] flex flex-col justify-center items-center gap-2'>
          {/* EXAMPLE LISTINGS */}
          <Box className=" w-full flex flex-row relative listings gap-2">
                <Box className="h-full flex listings-slide gap-2">
                  {exampleListings.map((listing, index) => (
                      <Listing key={index} listing={listing} />
                  ))}
                </Box>
                <Box className=" h-full flex listings-slide gap-2">
                  {exampleListings.map((listing, index) => (
                      <Listing key={index} listing={listing} />
                  ))}
                </Box>
          </Box>

          {/* EXAMPLE PROMPT ONE */}
          <Box className=" w-full flex flex-row relative listings gap-2">
                <Box className="h-full flex listings-slide-reverse gap-2">
                  {examplePromptsOne.map((prompt, index) => (
                      <Box key={index} className='w-full h-full px-4 py-3 border-[1px] border-[#393939] text-white/70 hover:text-white rounded-sm hover:cursor-pointer ease-in-out duration-300 hover:bg-[#4a4a4a]/30'>
                        <Typography variant='subtitle2' className=''>{prompt}</Typography>
                      </Box>
                  ))}
                </Box>
                <Box className=" h-full flex listings-slide-reverse gap-2">
                  {examplePromptsOne.map((prompt, index) => (
                      <Box key={index} className='w-full h-full px-4 py-3 border-[1px] border-[#393939] text-white/70 hover:text-white rounded-sm hover:cursor-pointer ease-in-out duration-300 hover:bg-[#4a4a4a]/30'>
                        <Typography variant='subtitle2' className=''>{prompt}</Typography>
                      </Box>
                  ))}
                </Box>
          </Box>
          {/* EXAMPLE PROMPT 2 */}
          <Box className=" w-full flex flex-row relative listings gap-2">
                <Box className="h-full flex listings-slide gap-2">
                  {examplePromptsTwo.map((prompt, index) => (
                      <Box key={index} className='w-full h-full px-4 py-3 border-[1px] border-[#393939] text-white/70 hover:text-white rounded-sm hover:cursor-pointer ease-in-out duration-300 hover:bg-[#4a4a4a]/30'>
                        <Typography variant='subtitle2' className=''>{prompt}</Typography>
                      </Box>
                  ))}
                </Box>
                <Box className=" h-full flex listings-slide gap-2">
                  {examplePromptsTwo.map((prompt, index) => (
                      <Box key={index} className='w-full h-full px-4 py-3 border-[1px] border-[#393939] text-white/70 hover:text-white rounded-sm hover:cursor-pointer ease-in-out duration-300 hover:bg-[#4a4a4a]/30'>
                        <Typography variant='subtitle2' className=''>{prompt}</Typography>
                      </Box>
                  ))}
                </Box>
          </Box>
        </Box>

        {/* CALL TO ACTION + TITLES */}

        {/* FAKE INPUT */}
        <Box className='w-[64%] flex flex-row items-center justify-between gap-2 fade-in-on-scroll cursor-pointer border mb-14 mt-10 border-white/50 rounded-md transition-all ease-in-out duration-300 hover:border-white px-4 py-3' >
          <Typography variant='h6' className={`fade-in-on-scroll text-[white]/70`}>
            Get Started!!
          </Typography>
            <IconSend size={30} stroke={2} className='text-[white] mr-2 fade-in-on-scroll placeholder:text-white' />
          </Box>

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