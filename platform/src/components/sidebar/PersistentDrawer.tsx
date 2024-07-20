// ** Next Imports
import * as React from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

// ** Style Imports
import { styled, useTheme } from '@mui/material/styles';

// * Icon Imports
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';

// ** Type Imports
import { DrawerContentType, UserType } from '@/utils/types';

// ** Util Imports
import { drawerComponents } from './drawer-components/vars';

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  width: 'min-content',
  marginLeft: `-${drawerWidth}px`,
  ...(open && {

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
  content: DrawerContentType;
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
          <Typography variant="h6" className="ml-5">{content.title}</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <IconChevronLeft color={theme.palette.text.secondary} /> : <IconChevronRight color={theme.palette.text.secondary} />}
          </IconButton>
        </DrawerHeader>
        <Card>
          <CardContent>
            {drawerComponents[content.component]}
          </CardContent>
        </Card>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}