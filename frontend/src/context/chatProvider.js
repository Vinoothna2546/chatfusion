import { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [user, setuser] = useState()
    const [SelectedChat, setSelectedChat] = useState()
    const [Chats, setChats] = useState([])
    const [Notifications, setNotifications] = useState([])
    // const navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setuser(userInfo.data);
        }
        // if (!userInfo) {
        //     navigate("/")
        //     navigate("/tabs")
        // }
    }, [])
    return (
        <ChatContext.Provider value={{ user, setuser, SelectedChat, setSelectedChat, Chats, setChats, Notifications, setNotifications }}>{children}</ChatContext.Provider>
    )
};

export const ChatState = () => {
    return useContext(ChatContext);
};
export default ChatProvider