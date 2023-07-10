import React from 'react'
import { ChatState } from '../context/chatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/sideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { useState } from 'react';

export default function ChatPage() {
    const { user } = ChatState();
    const [fetchAgain, setfetchAgain] = useState(false)
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="15px">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />}
            </Box>
        </div>
    )
}
