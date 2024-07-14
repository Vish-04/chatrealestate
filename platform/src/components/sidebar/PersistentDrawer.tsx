import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import Typography from '@mui/material/Typography';

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface PersistentDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
  content: React.ReactNode;
}

export default function PersistentDrawer({ open, handleDrawerClose, content }: PersistentDrawerProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            position: 'absolute',
            zIndex: 1,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(open ? {
              width: drawerWidth,
              marginLeft: 0,
            } : {
              width: 0,
              marginLeft: `-${drawerWidth}px`,
            }),
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <IconChevronLeft color={theme.palette.text.secondary} /> : <IconChevronRight color={theme.palette.text.secondary} />}
          </IconButton>
        </DrawerHeader>
        <Typography paragraph>
          {content}
        </Typography>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}