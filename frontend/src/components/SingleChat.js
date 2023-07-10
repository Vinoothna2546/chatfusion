import React, { useEffect } from 'react';
import { ChatState } from '../context/chatProvider';
import { Box, FormControl, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import animationData from '../images/typing3.json'
import ProfileModal from './ProfileModal';
import UpdategroupChat from './UpdategroupChat';
import { useState } from 'react';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import Lottie from "react-lottie"
const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const { user, SelectedChat, setSelectedChat, Notifications, setNotifications } = ChatState();
  const [Messages, setMessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newMessage, setnewMessage] = useState(" ");
  const [SocketConnected, setSocketConnected] = useState(false);
  const [Typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);

  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const getSenderdata = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const getSenderdataFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  useEffect(() => {
    if (!socket) {
    socket = require("socket.io-client")(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing",()=>setisTyping(true))
    socket.on("stop typing", () => setisTyping(false))
    }
    return () => {
      socket.off("connected");
    };

// eslint-disable-next-line 
  }, []);

  const fetchMessages = async () => {
    if (!SelectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      setloading(true);

      const { data } = await axios.get(`http://localhost:4000/api/message/${SelectedChat._id}`, config);
      setMessages(data);
      setloading(false);

      socket.emit("join chat", SelectedChat._id);
     
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: "Failed to load messags",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", SelectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        };
        setnewMessage(" ");
        const { data } = await axios.post(`http://localhost:4000/api/message/`, {
          content: newMessage,
          chatId: SelectedChat._id
        }, config);
       
        socket.emit("newmessage", data);
        setMessages([...Messages, data]);
        
      } catch (error) {
        toast({
          title: 'Error occurred',
          description: "Failed to load the search results",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = SelectedChat;
    // eslint-disable-next-line
  }, [SelectedChat]);

  useEffect(() => {


    socket.off("message receieved");
    socket.on("message receieved", (newMessageReceieved) => {
 
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceieved.chat._id
      ) {
        if (!Notifications.includes(newMessageReceieved)) {
          setNotifications([newMessageReceieved, ...Notifications]);
          setfetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...Messages, newMessageReceieved]);
      }
    });
   
  });

  const typingHandler = (e) => {
    setnewMessage(e.target.value);
    if(!SocketConnected) return;
    if(!Typing){
      setTyping(true);
      socket.emit("typing",SelectedChat._id)
    }
    let lastTypingTime=new Date().getTime();
    var timeLength=3000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var  timeDiff=timenow-lastTypingTime;

      if(timeDiff >= timeLength&& Typing){
        socket.emit("stop typing",SelectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };

// console.log(Notifications,"-----------------------");

  return (
    <>
      {SelectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {Messages &&
            (!SelectedChat.isGroupChat ? (
              <>{getSenderdata(user, SelectedChat.users)}
                <ProfileModal user={getSenderdataFull(user, SelectedChat.users)} />
              </>
            ) : (
              <>
                {SelectedChat.chatName}
                  <UpdategroupChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} fetchMessages={fetchMessages}/>
              </>
            ))}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
              {loading?(
              <Spinner
                size='xl'
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
              />
              ):(
              <div style={{display:"flex",flexDirection:"column",overflowY:"scroll",scrollbarWidth:"none"}}>
                  <ScrollableChat Messages={Messages}/>
              </div>)}

            <FormControl onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}>
              {isTyping ?
              (<div>
                  <Lottie
                  options={defaultOptions}
                  width={50}
                  style={{marginLeft:0,marginBottom:15}}
                  />
                  
                </div>):(
                  <></>
                )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>

      ) : (
        <Box display="flex" style={{ alignItems: "center" }} justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="'Playfair Display', serif">click on user to start chatting</Text>

        </Box>
      )}
    </>
  )
}

export default SingleChat