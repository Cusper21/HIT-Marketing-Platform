import React, { useContext, useState } from 'react'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ChatCard from '../chatCard/ChatCard'

import './sidePanel.scss'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../../axios'
import { AuthContext } from '../../../context/authContext';

const SidePanel = () => {

  const[searchText, setSearchText] = useState('')
  const{currentUser} = useContext(AuthContext)

  const { data: chats } = useQuery(["chats"], () =>
    makeRequest.get("/chats/").then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const filteredChats = chats?.filter((chat) =>
    searchText ? chat.user_name.toLowerCase().indexOf(searchText) !== -1 : chats
  )
  
  return (
    <div className='sidePanel'>

      <div className="top">
        <h3>Chats</h3>
      </div>

      <div className="input">
        <SearchRoundedIcon/>
        <input type="text" maxLength={20} placeholder='Find User' onChange={(e)=>{setSearchText(e.target.value.toLowerCase())}}/>
      </div>

      <div className="bottom">
        
        {filteredChats?.length <= 0 ? ( currentUser.id.includes('V') ? <span>Chats will appaer once customers initiate a conversation</span> : <span>Initiate a conversation with vendors via any one of their products' in-depth page</span>)
        :filteredChats?.map(chat=>(
          <ChatCard chat= {chat} key={chat.user_id}/>
          )
        )}

      </div>
    </div>
  )
}

export default SidePanel