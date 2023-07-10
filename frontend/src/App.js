import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Home } from './screens/Home';
import LogPages from './screens/logPages';
import ChatPage from './screens/Chatpage';
import ChatProvider from './context/chatProvider';
function App() {
  return (
    <>
    <Router>
      <ChatProvider>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/tabs" element={<LogPages/>} />
          <Route exact path="/chats" element={<ChatPage/>}/>
        </Routes>
      </ChatProvider>
      </Router>
    </>
  );
}

export default App;
