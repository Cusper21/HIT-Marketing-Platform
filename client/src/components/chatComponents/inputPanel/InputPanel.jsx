import React, { useContext, useState } from 'react'

import './inputPanel.scss'
import { ChatContext } from './../../../context/chatContext'
import { AuthContext } from './../../../context/authContext';
import { makeRequest } from '../../../axios'
import swal from 'sweetalert';
import SendRoundedIcon from '@mui/icons-material/SendRounded';


const InputPanel = () => {

  const {chatUser} = useContext(ChatContext)
  const {currentUser} = useContext(AuthContext)
  const [message,setMessage] = useState('');

  const m = async ()=>{
    try {
      await  makeRequest.post("/chats/send", {user_id:chatUser.user_id, message:message, id:currentUser.id, name:currentUser.name,image:currentUser.profile_picture}).then((res) => {
        setMessage('')
      })
    } catch (error) {
      swal('',error, 'error')
    }
  }

  const handleChange = (e)=>{
    setMessage(e.target.value)
  }

  const handleClick = (e)=>{
    e.preventDefault()
    if(message !== ''){

      m()
    }
  }

  return (
    <form className='inputPanel'>
      <input type="text" name="" value={message} id="send" placeholder='Type message' onChange={handleChange} required disabled={(currentUser && chatUser) ? false: true}/>
      <SendRoundedIcon onClick={handleClick} disabled={(currentUser && chatUser && message!=='') ? false: true} className='send'/>
    </form>
  )
}

export default InputPanel