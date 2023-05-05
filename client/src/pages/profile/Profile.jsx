import React, { useContext, useState } from 'react'
import './profile.scss'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import moment from "moment"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import {v4} from 'uuid'
import { Chip, Divider } from '@mui/material';
import swal from 'sweetalert';
import { AuthContext } from '../../context/authContext';

const Profile = () => {
  const{currentUser, setcurrentUser} = useContext(AuthContext)
  const queryClient = useQueryClient();
    
    const [image1, setImage1] = useState(null)
    const { error, isLoading, data: userprofile } = useQuery(["userprofile"], () =>
        makeRequest.get("/users/profile").then((res) => {
            return res.data
        }),
        { networkMode: "always" }
    )

    const uploadImage = async () => {

      try {
        const image1Ref = ref(storage, `images/${v4() + image1.name}`);
        await uploadBytes(image1Ref, image1).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async(url1) => {
            const res = await makeRequest.put('/users/updatepic', {url:url1})
              if (res.data.affectedRows){
                setcurrentUser({...currentUser, profile_picture:url1})
              queryClient.invalidateQueries(['vendorprofile'])
              }
          });
        })
      } catch (error) {
        swal('','No internet', 'error')
      }
        
      };
      
    const handleFormSubmit = async(e) => {
        e.preventDefault()
        if(image1){
          try {
            swal({
              title: 'Uploading Profile...',
              text: 'Please wait',
              allowOutsideClick: false,
              allowEscapeKey: false,
              onOpen: () => {
                swal.showLoading();
              },
            });
        
            await  uploadImage()
            swal.close();
            swal('',`Profile Updated!`,'success')
          } catch (err) {
            swal('',err,'error')
          }
           
        }else{
          swal('Choose image first',"info")
        }
    }

  return (
    <div className='profile'>
        {error ? alert('Something went wrong!')
        : isLoading ? "Loading"
        : userprofile?.map(user=>(
        <div className="ucard" key={user.id}>
            <div className="left">
                <img src={user.profile_picture ? user.profile_picture : './assets/user.png'} alt="" />
                <input type="file" name="" id="" className='file' onChange={(e)=> setImage1(e.target.files[0])}/>
                <button onClick={handleFormSubmit}>Save</button>
            </div>
            <div className="right">
                <h3>{user.first_name}</h3>
                <span className='username'>@{user.username}</span>
                <span className='username'>{user.email}</span>
                <span className='title'>{user.id.includes("V") ? "Vendor": "Customer"}</span>
                <div>
                <Divider className='divider'>
                  <Chip label='Customer Information' />
                </Divider>

                </div>
                <div className="information">
                    <span className='item'>First Name : {user.first_name}</span>
                    <span className="item">Last Name : {user.last_name}</span>
                    <span className="item">Gender : {user.gender}</span>
                    <span className="item">Date of Birth : {moment(user.date_of_birth).format('YYYY-MM-DD')}</span>
                </div>
            </div>
        </div>
        ))}        
    </div>
  )
}

export default Profile