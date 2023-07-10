import React from 'react';
import { ChatState } from '../context/chatProvider'
import { Button,  useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box ,Text,Stack} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import SearchLoading from './sidedrawercomponents/searchLoading';

import { GroupChatModal } from './GroupChatModal';
import backgroundImage from '../images/mychatsbg.png';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setloggedUser] = useState()
  const { user, Chats, setChats, SelectedChat, setSelectedChat } = ChatState()
  const toast = useToast();
  const getSender = (loggedUser, users) => {
    if (!loggedUser) {
      return "";
    }

    return users[0]._id === loggedUser.data._id ? users[1].name : users[0].name;
  };
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        const { data } = await axios.get(`http://localhost:4000/api/chat`, config);
        setChats(data);
      } catch (error) {
        toast({
          title: 'Error occurred',
          description: "Failed to load chats",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left',
        });
      }
    };

    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
     // eslint-disable-next-line
  }, [fetchAgain]);


  // const bodyy = {
  //   name: "kir",
  //   email: "pro",
  //   phone: "9876"
  // };

  // axios.post('http://localhost:4000/api/user/test', bodyy)
  //   .then(response => {
  //     console.log(response.data);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
  return (
    <Box 
      display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      style={{padding:"3px"}}
      bg="white"
      w={{ base: "100%", md: "33%" }}
      borderRadius="1g"
      borderWidth="1px"
      marginRight="5px"
      backgroundImage={`url(${backgroundImage})`}
     
    >
      <Box 

        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="'Playfair Display', serif"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        borderWidth="5px" border="0px"
        paddingTop="6px"
        paddingBottom="6px"
      >
        MyChats
        <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
   
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="1g"
        overflowY="hidden"
        backgroundImage={`url(${backgroundImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        // borderTopWidth="5px"
      >
        {Chats ? (
          <Stack overflowY="scroll" >
            {Chats.map((chat) => (
              <Box 
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={SelectedChat === chat ? "#327694" : "#E8E8E8"}
                color={SelectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
               
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ?getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
               
              </Box>
            ))}
          </Stack>
        ) : (
          <SearchLoading />
        )}
        </Box>
      
    </Box>
  )
}

export default MyChats