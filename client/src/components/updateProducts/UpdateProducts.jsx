import React, {useState } from 'react'
import {useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import './updateProducts.scss'
import { storage } from '../../firebase';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import swal from 'sweetalert';

const UpdateProducts = ({setOpen, item}) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const queryClient = useQueryClient();
  
  const [inputs, setInputs] = useState({
      id:item.id,
      description: item.description,
      size: item.size,
      name: item.name,
      colors: item.colors,
      price: item.price,
  });

  const handleUpload = () => {
    let urls = {};
    let promises = [];

    if (image1 && image2) {
      promises.push(uploadFile(image1));
      promises.push(uploadFile(image2));
    } else if (image1 && !image2) {
      promises.push(uploadFile(image1));
    } else if (image2 && !image1) {
      promises.push(uploadFile(image2));
    }

    Promise.all(promises).then(async(results) => {
      
      results.forEach((url, index) => {
        if (index === 0 && (image1 && !image2)) {
          urls.image1 = url
          urls.image2 = item.image2
        } else if (index === 0 && (image2 && !image1)) {
          urls.image2 = url
          urls.image1 = item.image1
        } else if (index === 0 && (image1 && image2)) {
          urls.image1 = url
        } else if (index === 1 && (image1 && image2)) {
          urls.image2 = url
        }
      });

      await makeRequest.put('/products/update', {...inputs, ...urls}).then(()=>{
        queryClient.refetchQueries(["allproducts"]);
        setOpen(false)
        setImage1(null)
        setImage2(null)
      })
    });
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(storage, `images/${v4() + file.name}`);
      try {
        uploadBytes(fileRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            resolve(url);
          });
        })
      } catch (error) {
        swal('','No Internet','error')
      }
      

    });
  };

  const handleChange = (e) => {
      setInputs((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };
  
  const handleClick = async (e) => {
    e.preventDefault();
    if(!image1 && !image2){

      try{
        await makeRequest.put('/products/update', {...inputs, image1:item.image1, image2:item.image2}).then(()=>{
          queryClient.refetchQueries(["allproducts"]);
          swal("Successful", `Password Changed`, "error");
        })
        } catch (error) {
        const errorMessage = error.response.data;
        swal("", `${errorMessage}`, "error");
        }
      
    }else{
      try {
        swal({
          title: 'Uploading Images...',
          text: 'Please wait',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading();
          },
        });
    
        await handleUpload()
    
        swal.close();
        swal('',`Product Saved`,'success')
      } catch (error) {
        swal('',`${error}`,'error')
      }
      
    }
  }
    
  return (
    <div className="update" onClick={() => setOpen(false)}>
      <form className="container" onClick={(e) => e.stopPropagation()}>
        <h3>Update Product</h3>
        <div className="files">
          <div className="imgContainer">
            <img src={image1 ? URL.createObjectURL(image1): item.image1} alt="" />
            <input required type="file" id="image1" className='file' onChange={(e) => setImage1(e.target.files[0])}/>
          </div>

          <div className="imgContainer">
            <img src={image2? URL.createObjectURL(image2) : item.image2} alt=""/>
            <input required type="file" id="image2" className='file' onChange={(e) => setImage2(e.target.files[0])}/>
          </div>
        </div>

        <input required type="text" maxLength={40} placeholder="Enter Name" name='name' value={inputs.name} onChange={handleChange}/>
        <input required type="text" maxLength={200} placeholder="Enter Description" name='description' value={inputs.description} onChange={handleChange}/>
        <input required type="number" min={1} maxLength={6} placeholder="Enter Price" name='price' className='price' value={inputs.price} onChange={handleChange}/>
        <input required type="text" maxLength={50} placeholder="Enter Size" name='size' className='size' value={inputs.size} onChange={handleChange}/>
        <input required type="text" maxLength={100} placeholder="Enter Colors" name='colors' value={inputs.colors} onChange={handleChange}/>
        <button onClick={handleClick}>Update</button>
      </form>
  </div>
);
};

export default UpdateProducts