import React from 'react'
import { Button, IconButton, Image, Text } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import backgroundImage from '../images/modalbggg.png';

<style>
    @import url('https://fonts.googleapis.com/css2?family=Caveat&family=Mali&family=Klee+One:wght@600&family=Playfair+Display&display=swap');
</style>
const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children?(
                <span onClick={onOpen}>{children}</span>
            ):(
                <IconButton
                display={{base:"flex"}}
                icon={<ViewIcon/>}
                onClick={onOpen}
                />
            )}


            {/* <Button onClick={onOpen}>Open Modal</Button> */}

            <Modal  size="lg" isOpen={isOpen} onClose={onClose} isCentered  >
                <ModalOverlay />
                <ModalContent h="400px" backgroundImage={`url(${backgroundImage})`}>
                    <ModalHeader fontSize="40px"
                        fontFamily="'Playfair Display', serif"
                        display="flex"
                        justifyContent="center"
                        textShadow="2px 2px 4px rgba(0, 0, 0, 0.4)"
                        style={{ alignItems: 'center' }}
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                    display="flex"
                    flexDirection="column"
                    
                    justifyContent="space-between"
                    style={{alignItems:'center'}}
                    >
                       <Image
                       borderRadius="full"
                       boxSize="150px"
                       src={user.pic}
                       alt={user.name}
                            boxShadow="xl" 
                       />
                       <Text
                       fontSize={{base:'28px',md:'10x'}}
                            fontFamily="'Playfair Display', serif"
                            // textShadow="2px 2px 4px rgba(0, 0, 0, 0.4)"
                            fontWeight="400"
                       >
                        Email:{user.email}
                       </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal