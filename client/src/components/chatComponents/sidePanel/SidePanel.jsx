import React from 'react'

import Search from '../search/Search'
import ChatCard from '../chatCard/ChatCard'

import './sidePanel.scss'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../../axios'

const SidePanel = () => {

  const {  data: chats } = useQuery(["chats"], () =>
    makeRequest.get("/chats/").then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )
  
  return (
    <div className='sidePanel'>

      <div className="top">
        <h4>Chats</h4>
      </div>

      <Search/>
      <div className="bottom">
        
        {
        chats?.map(chat=>(
          <ChatCard chat= {chat} key={chat.user_id}/>
          )
        )}

      </div>
    </div>
  )
}

export default SidePanel