import React from 'react'

import './reports.scss'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery} from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { Card } from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import moment from 'moment';

const ProductColumns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    
  },
  {
    field: 'size',
    headerName: 'Size',
    width: 150,
    
  },
  {
    field: 'price',
    headerName: 'Price/US$',
    type: 'number',
    width: 110,
    
  },
  {
    field: 'colors',
    headerName: 'Colors',
    width: 150,
    
  },
  {
    field: 'date_added',
    headerName: 'Date Added',
    width: 150,
    valueFormatter: (params) => moment(params.value).format('DD-MM-YYYY')
  }
];

const UserColumns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    
  },
  {
    field: '',
    headerName: 'Access Level',
    width: 200,
    
    valueGetter: (params) =>
      `${params.row.id.includes('V') ? 'Vendor': 'Customer'}`
  },
  {
    field: 'username',
    headerName: 'Username',
    width: 150,
    
  },
  {
    field: 'email',
    headerName: 'Email Address',
    width: 200,
    
  },
  {
    field: 'join_date',
    headerName: 'Date Joined',
    width: 150,
  },
];


const Reports = () => {

  const { error, isLoading, data: products } = useQuery(["allproducts"], () =>

  makeRequest.get("/products/all").then((res) => {
    return res.data
  }),
  { networkMode: "always" }
  )

  const { error: userError, isLoading: userLoading, data: users } = useQuery(["users"], () =>

  makeRequest.get("/users/").then((res) => {
    return res.data
  }),
  { networkMode: "always"}
  )

  const usersGain = users?.filter((user) =>
    moment(user.join_date).isAfter(moment().subtract(1, 'months'))
  )

  const productsGain = products?.filter((product) =>
    moment(product.date_added).isAfter(moment().subtract(1, 'months'))
  )

  const percentageProductGain = (productsGain?.length / products?.length) * 100

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  const percentageUserGain = (usersGain?.length / users?.length) * 100

  const { error: customerError, isLoading: customerLoading, data: customers } = useQuery(["customers"], () =>

  makeRequest.get("/users/customers").then((res) => {
    return res.data
  }),
  { networkMode: "always" }
  )
  
  const { error: vendorError, isLoading: vendorLoading, data: vendors } = useQuery(["vendors"], () =>

  makeRequest.get("/users/vendors").then((res) => {
    return res.data
  }),
  { networkMode: "always" }
  )

  return (
    <div className='reports'>
      <div className="stats">
        <Card className='container'>
          <GroupRoundedIcon className='icon'/>
          <div className="bottom">
            <div className="item1">
              <h1>{customers && formatNumber(customers?.length)}</h1>
              <h4>Customers</h4> 
            </div>
            <div className="item1">
              <h1>{vendors && formatNumber(vendors?.length)}</h1>
              <h4>Vendors</h4> 
            </div>
            <div className="item1">
              <h1>{users && formatNumber(users?.length) }</h1>
              <h4>Total users</h4> 
            </div>
            <div className="item1">
              <h1>{Math.round(percentageUserGain)}%</h1>
              <h4>Gain / week</h4> 
            </div>
          </div>
        </Card>

        <Card className='container'>
          <CategoryRoundedIcon className='icon'/>
          <div className="bottom">
            <div className="item1">
              <h1>{products && formatNumber(products?.length) }</h1>
              <h4>Products</h4> 
            </div>
            <div className="item1">
              <h1>{Math.round(percentageProductGain)}%</h1>
              <h4>Gain / week</h4> 
            </div>
          </div>
        </Card>
      </div>
      <h3>Products</h3>
      <Box sx={{ height: 400, width: 'fit-content'}}>
        { error ? 'Something Went Wrong':
        isLoading ? 'Loading Table'
        : products &&
      <DataGrid
        rows={products && products}
        columns={ProductColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ backgroundColor: 'white', borderRadius: 3 }}
      />
        }
    </Box>
      <h3>Users</h3>
      <Box sx={{ height: 400, width: 'fit-content'}}>
        {userError ? 'Something Went Wrong':
        userLoading ? 'Loading Table'
        : users &&
      <DataGrid
        rows={users}
        columns={UserColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ backgroundColor: 'white', borderRadius: 3 }}
      />
        }
    </Box>
    </div>
  )
}

export default Reports