import React from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios';
import {
    useNavigate
} from "react-router-dom";
export default function LoginForm() {

    const [email, setEmail] = useState(" ")
    const [password, setPassword] = useState(" ")
    const [Loading, setLoading] = useState(false);
    const [show, setShow] = useState(false)
    const toast=useToast();
    const navigate = useNavigate();
    const handleClick = () => setShow(!show);
    
    const submitHandler=async()=>{
        setLoading(true);
        if ( !email || !password ) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };
            const { data } = await axios.post("http://localhost:4000/api/user/login", { email, password}, config);
            toast({
                title: 'Login successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            localStorage.setItem("userInfo", JSON.stringify( {data} ));
            setLoading(false);
            navigate('/chats');
        } catch (error) {
            toast({
                title: 'error occured',
                // description: error.response.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            setLoading(false);
        }
    }
    return (
        <VStack >
            
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <Button
                isLoading={Loading}
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler} 
            >
               Login
            </Button>
        </VStack>
    )
}
