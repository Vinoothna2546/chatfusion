import React from 'react';
import "./Home.css"
import { Link } from 'react-router-dom';
import { Button,Stack,ButtonGroup} from '@chakra-ui/react'
<style>
    @import url('https://fonts.googleapis.com/css2?family=Caveat&family=Mali&family=Playfair+Display&display=swap');
</style>

export const Home = () => {
    // const screenWidth = window.innerWidth;
    // const screenHeight = window.innerHeight;

    // console.log("Screen Width: " + screenWidth + "px");
    // console.log("Screen Height: " + screenHeight + "px");

    return (
        <div className='Home'>
            <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '100px', margin: '140px 10px 0px 30px',color:'black', textShadow: '3px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    Chat Fusion...
                </div>
                <h5 style={{fontWeight:'300', fontSize: "25px", margin: '0px 10px 25px 50px', fontFamily: "'Caveat', cursive", filter:" brightness(0.2)" }}>
                    Experience the Fusion of Real-Time Conversations
                </h5>
                <Stack marginLeft="130px" direction='row' spacing={10} >
                    
                        <ButtonGroup gap='4'>
                        <Link to="/tabs">
                            <Button width='120px' bg="#fdd849" color="black">Login</Button>
                        </Link>
                        <Link to="/tabs"> 
                            <Button width='120px' transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                _active={{ bg: '#ebedf0', color: "black" }}
                                _hover={{
                                    bg: '#fd029e',
                                    color: "white"

                                }} >signup</Button>
                        </Link>
                        </ButtonGroup>
                    
                </Stack>
            </div>
        </div>
    );
};
