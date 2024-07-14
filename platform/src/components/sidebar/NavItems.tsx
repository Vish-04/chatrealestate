import { IconEdit, IconMessageCircle } from "@tabler/icons-react"
import { SidebarType } from "@/utils/types"
import * as React from 'react';

export const sidebar = (setDrawerContent: (content: string) => void, setDrawerOpen: (open: boolean) => void): SidebarType[] => [
    { 
        icon: <IconEdit size={27} stroke={1.5} className='text-[#6f6f6f] hover:text-white transition-colors ease-in-out duration-300 m-2' />, 
        title: 'New Chat', 
        onClick: async (e) => {
            setDrawerContent('New Chat');
            setDrawerOpen(true);
        } 
    }, 
    { 
        icon: <IconMessageCircle size={27} stroke={1.5} className='text-[#6f6f6f] hover:text-white transition-colors ease-in-out duration-300 m-2' />, 
        title: 'Chat History', 
        onClick: (e) => {
            setDrawerContent('Chat History');
            setDrawerOpen(true);
        }
    }, 
];