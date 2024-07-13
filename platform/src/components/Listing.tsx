import { Box } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import { Typography } from '@mui/material'

type ListingType = {
    image: string,
    address: string,
    price: string,
    bedrooms: string,
    bathrooms: string,
    sqft: string
  }
  
const Listing = ({listing}: {listing: ListingType}) => {
    console.log("LIST", listing)
  return (
    <Box className='group flex flex-col items-center w-min justify-center p-4 border-[1px] border-[#393939] rounded-sm transition-all duration-300 hover:bg-[#4a4a4a]/30 hover:scale-103 hover:cursor-pointer'>
        <Box sx={{ width: 148.8*2, height: 94*2, position: 'relative' }}>
            <Image src={listing.image} alt='listing image' layout='fill' objectFit='cover' />
        </Box>
        <Typography variant='subtitle1' className='text-center text-white/70 group-hover:text-white ease-in-out duration-300'>{listing.price} - {listing.address}</Typography>
        <Typography variant='subtitle2' className='text-center text-white/70 group-hover:text-white ease-in-out duration-300'>{listing.bedrooms} Bed {listing.bathrooms} Bath - {listing.sqft}</Typography>
    </Box>
  )
}

export default Listing