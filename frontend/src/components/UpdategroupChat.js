import React ,{useState}from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
IconButton,
Button,
Box,
FormControl,
Input,
Spinner
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../context/chatProvider';
import { useToast } from '@chakra-ui/react';
import UserBadgeItem from './sidedrawercomponents/userBadgeItem';
import axios from 'axios';
import UserListItem from './sidedrawercomponents/UserListItem';

const UpdategroupChat = ({ fetchAgain, setfetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
   
    const { user, SelectedChat, setSelectedChat } = ChatState()
    const [groupChatName, setGroupChatName] = useState();
    const [Search, setSearch] = useState("");
    const [SearchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [RenameLoading, setRenameLoading] = useState(false);
    const toast = useToast();
    const handleRemove=async(userz)=>{
        if (SelectedChat.groupAdmin._id !== user._id  && userz.id !== user._id) {
            toast({
                title: 'only admins can delete someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {

                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put(`http://localhost:4000/api/chat/groupremove`, {
                chatId: SelectedChat._id,
                userId: userz._id
            }, config);
            userz._id === user._id ? setSelectedChat() : setSelectedChat(data);
            fetchMessages();
            setfetchAgain(!fetchAgain);
            setLoading(false)

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

    };

    const handleRename = async() => {
        if(!groupChatName) return
        try {
            setRenameLoading(true)
            const config = {
                headers: {

                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put(`http://localhost:4000/api/chat/rename`,{
                chatId:SelectedChat._id,
                chatName:groupChatName
            }, config);

            setSelectedChat(data);
            setfetchAgain(!fetchAgain);
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false)
        }
        setGroupChatName("");
     };
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
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
            setSearchResult(data)
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

const handleAddUser=async(userz)=>{
    if(SelectedChat.users.find((u)=> u._id===userz._id)){
        toast({
            title: 'user already in group',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
        });
        return;
    }

    if(SelectedChat.groupAdmin._id !== user._id){
        toast({
            title: 'only admins can add someone!',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
        });
        return;
    }
    try {
        setLoading(true)
        const config = {
            headers: {

                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.put(`http://localhost:4000/api/chat/groupadd`, {
            chatId: SelectedChat._id,
           userId: userz._id
        }, config);

        setSelectedChat(data);
        setfetchAgain(!fetchAgain);
        setLoading(false)
        
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
   

    return (
        <>
            <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px"
                        fontFamily="Playfair Display, serif"
                        display="flex"
                        justifyContent="center">{SelectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                        {SelectedChat.users.map((u)=>(
                            <UserBadgeItem key={u._id}
                            user={u}
                            handleFunction={()=>handleRemove(u)}
                            />
                        ))}
                       </Box>
                       <FormControl display="flex">
                        <Input
                        placeholder='chat name'
                        mb={3}
                        value={groupChatName}
                        onChange={(e)=>setGroupChatName(e.target.value)}
                        
                        />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={RenameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                       </FormControl>
                       {loading?(
                        <Spinner size="lg"/>
                       ):(
                             SearchResult?.slice(0, 4).map((user)=>(
                            <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={()=>handleAddUser(user)}
                            />
                        ))
                       )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={()=>handleRemove(user)}>
                           Leave Group
                        </Button>
                        
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdategroupChat