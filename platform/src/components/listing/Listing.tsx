import { Box } from '@mui/material'
import React from 'react'
import Image from "next/legacy/image"
import { Typography } from '@mui/material'
import { ListingType } from '@/utils/types'
  
const Listing = ({listing}: {listing: ListingType}) => {
  return (
    <Box className='group flex flex-col items-center w-min justify-center p-4 border-[1px] border-[#393939] rounded-sm transition-all duration-300 hover:bg-[#4a4a4a]/30 hover:cursor-pointer'>
        <Box sx={{ width: 148.8*2, height: 94*2, position: 'relative' }}>
            <Image src={listing.image.S} alt='listing image' layout='fill' objectFit='cover' />
        </Box>
        <Typography variant='subtitle1' className='text-center text-white/70 group-hover:text-white ease-in-out duration-300'>{listing.price.S} - {listing.address.S}</Typography>
        <Typography variant='subtitle2' className='text-center text-white/70 group-hover:text-white ease-in-out duration-300'>{listing.bedrooms.S} Bed {listing.bathrooms.S} Bath - {listing.sqft.S}</Typography>
    </Box>
  )
}

export default Listing