import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    FormControl,
    Input,
    Box
} from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../context/chatProvider'
import axios from 'axios'
import UserListItem from './sidedrawercomponents/UserListItem'
import UserBadgeItem from './sidedrawercomponents/userBadgeItem'



export const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setgroupChatName] = useState();
    const [selectedUsers, setselectedUsers] = useState([]);
    
    const [Search, setSearch] = useState("");
        const [searchResult, setsearchResult] = useState([]);
        const [Loading, setLoading] = useState(false);
    const [chatLoading, setchatLoading] = useState(false);
    const toast=useToast();
    const{user,Chats,setChats}=ChatState();
    const handleSearch=async(query)=>{
        setSearch(query);
        if(!query){
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`http://localhost:4000/api/user?search=${Search}`, config);
            setLoading(false);
            setsearchResult(data)
            console.log(data)
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
    const handleSubmit =async () => {
        setchatLoading(true)
        if(!groupChatName || ! selectedUsers){
            toast({
                title: 'please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            return;
            
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post(`http://localhost:4000/api/chat/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id))
            }, config);
            setChats([data,...Chats]);
            onClose();
            toast({
                title: 'New group chat created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            setchatLoading(false)
        } catch (error) {
            toast({
                title: 'error occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            setchatLoading(false)
        }
     }
    const handleDelete = (deluser) => { 
        setselectedUsers(selectedUsers.filter(sel=>sel._id!==deluser._id))
    }
    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            return;
        }
        setselectedUsers([...selectedUsers,userToAdd])
     };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                    fontSize="35px"
                        fontFamily="'Playfair Display', serif"
                        display="flex"
                        justifyContent="center">Create Group chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" style={{alignItems:"center"}}>
                        <FormControl>
                            <Input placeholder='Group Name'
                            mb={3}
                            onChange={(e)=>setgroupChatName(e.target.value)}/>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)} />
                          
                        ))}
                        </Box>
                        {Loading?<div>loading...</div>:(
                            searchResult?.slice(0,4).map(user=>(
                                <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit} isLoading={chatLoading} >
                            Create chat
                        </Button>
                      
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
