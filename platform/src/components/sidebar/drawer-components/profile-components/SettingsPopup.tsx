import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface SettingsPopupProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({ anchorEl, open, onClose }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{
        width: '300px',
        height: '300px',
        marginLeft: '10px'
      }}
    >
      <Box p={2}>
        <Typography variant="h6">Settings</Typography>
        <Typography variant="body2">Settings content goes here...</Typography>
      </Box>
    </Popover>
  );
};

export default SettingsPopup;