import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { ChatState } from '../context/chatProvider'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { Avatar, Tooltip } from '@chakra-ui/react'


const ScrollableChat = ({ Messages }) => {
    const { user } = ChatState()


    return (
        <ScrollableFeed>
            {Messages && Messages.map((m, i) => {
               
                return (
                    <div style={{ display: "flex" }} key={`${m._id}-${i}`}>
                        {(isSameSender(Messages, m, i, user._id) || isLastMessage(Messages, i, user._id)) && (
                            
                            <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}

                        <span
                        style={{
                            backgroundColor:`${
                                    m.sender._id === user._id ? "#fd3495" :"#103380"
                            }`,
                            color:"white",
                            borderRadius:"20px",
                            padding:"5px 15px",
                            maxWidth:"75%",
                            marginLeft:isSameSenderMargin(Messages,m,i,user._id),
                            marginTop:isSameUser(Messages,m,i,user._id)?3:10,
                            
                        }}
                        >
                            {m.content}
                        </span>
                    </div>
                )
            })}
        </ScrollableFeed>
    )
}

export default ScrollableChat
