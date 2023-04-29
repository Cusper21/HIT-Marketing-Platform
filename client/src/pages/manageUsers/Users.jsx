import React, { useEffect, useState } from 'react'

import "./users.scss"
import { makeRequest } from '../../axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const Users = () => {

  const queryClient = new useQueryClient()
  const [userInfo,setUserInfo] = useState(null)

  const { error, isLoading, data: users } = useQuery(["users"], () =>

  makeRequest.get("/users/").then((res) => {
    return res.data
  }),
  { networkMode: "always" }
  )

  useEffect(() => {
    const q = async()=>{
      
      if(userInfo?.ban === 1)
      return await makeRequest.put('/users/redeemuser', userInfo)
      return await makeRequest.put('/users/banuser', userInfo)
    }
    if(userInfo?.tablename){
      q()
    }
  }, [userInfo])
  

  const handleBan = async(e,user)=>{
    e.preventDefault()
    if(user.id.startsWith("V")){
      setUserInfo({...user, tablename:"vendors"})
    }else{
      setUserInfo({...user, tablename:"customers"})
    }

    await queryClient.refetchQueries({ queryKey: ['users']})
    alert("User Banned")
  }

  const handleRedeem = async(e,user)=>{
    e.preventDefault()
    if(user.id.startsWith("V")){
      setUserInfo({...user, tablename:"vendors"})
    }else{
      setUserInfo({...user, tablename:"customers"})
    }
    
    await queryClient.refetchQueries({ queryKey: ['users']})
    alert("User Redeemed")
  }

  return (
    <div className='users'>

      {error ? window.alert(error)
      : isLoading ? ""
      : users?.map(user=>(
        <div className="ucard" key={user.id}>
            <div className="left">
                <img src={user.profile_picture} alt="" />
            </div>
            <div className="right">
            <span className='title'>{user.id.includes("V") ? "vendor": "user"}</span>
            <h3>{user.name}</h3>
            <span className='username'>@{user.username}</span>
            <div className="ban">
              {user.ban?
              <button onClick={(e)=>{ handleRedeem(e,user)}}>Redeem</button>
              :<button onClick={(e)=>{handleBan(e,user)}}>Ban</button>
            }
            </div>

            </div>
        </div>
      ))}

    </div>

  )
}

export default Users