import { createContext } from "react";
import useState from 'react-usestateref';

export const ChatContext = createContext()

export const ChatContextProvider = ({children}) =>{

  const [chatUser, setChatUser] = useState();

  return <ChatContext.Provider value={{chatUser, setChatUser}}>
      {children}
  </ChatContext.Provider>
}