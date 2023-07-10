import React from 'react'
// import { useNavigate } from 'react-router-dom'
import "./Home.css"
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
// import { useEffect } from 'react'

export default function LogPages() {

  // const navigate = useNavigate();
  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
  //   if (userInfo) {
  //     navigate("/chats")
  //   }
  // }, [navigate])

  return (
    <div className='tabpage'>
      <Container maxW="xl" centerContent> <Box d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">

        <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
          Chat Fusion...
        </Text>
          </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab _selected={{ color: 'white', bg: '#103380' }}>Login</Tab>
              <Tab _selected={{ color: 'white', bg: '#fd029e' }}>SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel >
                <LoginForm/>
              </TabPanel>
              <TabPanel >
                <SignupForm/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
          </Container>
       
    </div>
  )
}
 