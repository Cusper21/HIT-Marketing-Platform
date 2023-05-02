import { createContext } from "react";
import useState from 'react-usestateref';

export const ChatContext = createContext()

export const ChatContextProvider = ({children}) =>{

  const [chatUser, setChatUser] = useState();
  const [ref, setRef] = useState(null);

  return <ChatContext.Provider value={{chatUser, setChatUser, ref, setRef}}>
      {children}
  </ChatContext.Provider>
}