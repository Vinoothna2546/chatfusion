import { useState} from "react";
import React from 'react';
import { Avatar, Box, Button,  Input,  Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from "../context/chatProvider";
import ProfileModal from "./ProfileModal";
import {  useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useToast
} from '@chakra-ui/react'
import axios from "axios";
import SearchLoading from "./sidedrawercomponents/searchLoading";
import UserListItem from "./sidedrawercomponents/UserListItem";
import backgroundImage from '../images/sidedrawerimg.png';
import NotificationBadge from "react-notification-badge";
import {Effect} from "react-notification-badge";
const SideDrawer = () => {
    const toast = useToast()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setloadingChat] = useState()
   
    const { user, Chats, setChats, setSelectedChat, Notifications, setNotifications }=ChatState()
    const Navigate=useNavigate()
   const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    Navigate("/")
   }
    const getSender = (loggedUser, users) => {
        if (!loggedUser) {
            return "";
        }

        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    };
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const handleSearch=async()=>{
        if(!search){
            toast({
                title: 'Please enter something to search',
                status: 'info',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`http://localhost:4000/api/user?search=${search}`,config);
            setLoading(false);
            setSearchResult(data)
            
        } catch (error) {
            toast({
                title: 'error occured',
                description: "faied to load the search results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoading(false);
        }
    }

    const accessChat=async(userId)=>{
        try {
            setloadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post(`http://localhost:4000/api/chat`,{userId}, config);
            if(!Chats.find((c)=>c._id===data._id))setChats([data,...Chats]);

            setSelectedChat(data);
            setloadingChat(false);
            onClose()
        } catch (error) {
            toast({
                title: 'error fetching chat',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };
    
    return (
        <>
            <Box display="flex" justifyContent="space-between" allignitems="center" bg="#08b1c4" w="100%"
            p="5px 10px 5px 10px" borderWidth="5px" border="0px" >
                <Tooltip
                    label="search users to chat"
                    hasArrow
                    placement="bottom-end">
                    <Button ref={btnRef} onClick={onOpen} colorScheme="blackAlpha"><i className="fas fa-search fa-lg" style={{ color: "#00000"}}></i>
                    <Text display={{base:"none",md:"flex"}} px='4'>search user</Text>
                    </Button>   
                </Tooltip>
                <Text fontSize="3xl" fontFamily="'Playfair Display', serif">Chat Fusion...</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={Notifications.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="3xl" m={1}/>
                        </MenuButton>
                        <MenuList pl={2}>
                            {!Notifications.length && "No new messages"}
                            {Notifications.map(notif=>(
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotifications(Notifications.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                            <Avatar
                            size='sm'
                            cursor="pointer"
                             name={ user.name}
                            src={user.pic}
                            />
                        </MenuButton>
                        <MenuList bg="#327694">
                            <ProfileModal user={user}>
                                <MenuItem bg="#327694" color="white" >My Profile</MenuItem>
                                </ProfileModal>
                            <MenuDivider/>
                            <MenuItem bg="#327694" color="white" onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent backgroundImage={`url(${backgroundImage})`} >
                    <DrawerCloseButton />
                    <DrawerHeader  borderBottomWidth="1px">Search Users</DrawerHeader>

                    <DrawerBody>
                       <Box display="flex" pb={2}>
                            <Input  placeholder="Search by name or email"
                            mr={2}
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                            variant="solid"/>
                            <Button onClick={handleSearch}><i className="fas fa-search fa-sm" style={{ color: "#00000" }}></i></Button>
                       </Box>
                       {loading?(
                        <SearchLoading/>
                       ):(
                        searchResult?.map(user=>(
                            user && (
                            <UserListItem
                            key={user?._id}
                            user={user}
                            handleFunction={()=>accessChat(user?._id)}
                            />
                            )
                        ))
                       )}
                       {loadingChat && <Spinner ml="auto" display="flex"/>}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer