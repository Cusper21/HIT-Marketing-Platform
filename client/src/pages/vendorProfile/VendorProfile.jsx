import React, { useContext, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import {v4} from 'uuid'
import "./vendorProfile.scss"
import VendorPopUp from '../../components/vendorPopUp/VendorPopUp';
import { Chip, Divider } from '@mui/material';
import swal from 'sweetalert';
import { AuthContext } from '../../context/authContext';

const VendorProfile = () => {
  const{currentUser, setcurrentUser} = useContext(AuthContext)
  const queryClient = useQueryClient();

    const [popUp, setPopUp] = useState(false)

    const [image1, setImage1] = useState(null)
 
    const { error, isLoading, data: vendorprofile } = useQuery(["vendorprofile"], () =>
        makeRequest.get("/users/vendorprofile").then((res) => {
            return res.data
        }),
        { networkMode: "always" }
    )

    const uploadImage = async () => {
        const image1Ref = ref(storage, `images/${v4() + image1.name}`);
        await uploadBytes(image1Ref, image1).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async(url1) => {
            const res = await makeRequest.put('/users/updatevendorpic', {url:url1})
            if (res.data.affectedRows){
              setcurrentUser({...currentUser, profile_picture:url1})
              queryClient.invalidateQueries(['vendorprofile'])
            }
          });
        })
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
    <div className='vendorprofile'>
         {error ? alert('Something went wrong!')
        : isLoading ? "Loading"
        : vendorprofile?.map(vendor=>(
        <div className="ucard" key={vendor.id}>
            <div className="left">
                <img src={vendor.profile_picture} alt="" />
                <input type="file" name="" id="" className='file' onChange={(e)=> setImage1(e.target.files[0])}/>
                <button onClick={handleFormSubmit}>Save</button>
            </div>
            <div className="right">
                <h3>{vendor.name}</h3>
                <span className='username'>@{vendor.username}</span>
                <span className='username'>{vendor.email}</span>
                <span className='title'>Vendor</span>
                <div>
                <Divider className='divider' style={{  }}>
                  <Chip label='Vendor Information' />
                </Divider>
              </div>
                <div className="information">
                    <span className='item'>Name : {vendor.name}</span>
                    <span className="item">Type : {vendor.type}</span>
                    <span className="item">Address : {vendor.address}</span>
                    <span className="item">Cell : {vendor.cell}</span>
                </div>
                <div className="button">
                    <button onClick={(e)=>setPopUp(true)}>Update</button>
                </div>
            </div>
            {popUp && <VendorPopUp setPopUp={setPopUp} vendor={vendor}/>}
        </div>
        
        ))}        
    </div>
  )
}

export default VendorProfile