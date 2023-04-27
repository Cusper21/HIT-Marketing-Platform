import React from 'react'

import "users.scss"

const Users = () => {

    const { data: users } = useQuery(["bookmarks", currentUser.id], () =>

    makeRequest.get("/bookmarks/userbookmarks").then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  return (
    <div className='users'>
        .
    </div>
  )
}

export default Users