// ** Next Imports
import * as React from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const scale = (value: number) => {
  if (value <= 66) {
    return (value / 66) * 1000000;
  } else {
    return 1000000 + ((value - 66) / 34) * 4000000;
  }
};

const inverseScale = (value: number) => {
  if (value <= 1000000) {
    return (value / 1000000) * 66;
  } else {
    return 66 + ((value - 1000000) / 4000000) * 34;
  }
};

export default function ChatSlider({value, setValue}: {value: number[], setValue: (value: number[]) => void}) {

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue((newValue as number[]).map(scale));
  };

  return (
    <Box className=' w-1/2 flex items-center'>
        <Typography className='w-[20px]'>
          {value[0] >= 1000000 ? `${(value[0] / 1000000).toFixed(1)}M` : value[0] >= 1000 ? `${(value[0] / 1000).toFixed(1)}K` : value[0]}
        </Typography>
      <Slider
        getAriaLabel={() => 'Budget range'}
        value={value.map(inverseScale)}
        defaultValue={[0, 66, 100]}
        onChange={handleChange}
        valueLabelDisplay="off"
        min={0}
        max={100}
        step={1} // Adjust step to account for the scale
        className='mx-10'
        color='secondary'
      />
      <Typography className='w-[20px]'>
        {value[1] >= 1000000 ? `${(value[1] / 1000000).toFixed(1)}M` : value[1] >= 1000 ? `${(value[1] / 1000).toFixed(1)}K` : value[1]}
      </Typography>
    </Box>
  );
}