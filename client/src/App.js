import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import UserRegistration from "./components/userRegForm/UserRegistration";
import CompanyRegistration from "./components/companyRegForm/CompanyRegistration";
import Sidebar from "./components/sidebar/Sidebar";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import SingleProduct from "./pages/singleProduct/SingleProduct";
import Chat from './pages/chat/Chat'
import CompareProducts from "./pages/compareProducts/CompareProducts";

import "./app.scss";
import Profile from "./pages/profile/Profile";
import AddProduct from "./pages/addProduct/AddProduct";
import ManageProducts from "./pages/manageProducts/ManageProducts";
import ReportedProducts from "./pages/reportedProducts/ReportedProducts";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { SearchContextProvider } from './context/searchContext';
import { ChatContextProvider } from "./context/chatContext";
import { CategoriesContextProvider } from "./context/categoriesContext";

import Bookmarks from "./pages/bookmarks/Bookmarks";
import { CompareContextProvider } from "./context/compareContext";
import Users from "./pages/manageUsers/Users";
import ManageAllProducts from "./pages/manageAllProducts/ManageAllProducts";
import VendorProfile from "./pages/vendorProfile/VendorProfile";
import ChangePassword from "./pages/changePassword/ChangePassword";
import Admin from "./pages/adminDash/Admin";

function App() {

  const queryClient = new QueryClient()

  const {currentUser} = useContext(AuthContext)
  
  const RegistrationLayout = () =>{
    return(
      <Register/>
    )
  }
  
  const DefaultLayout = () =>{
    return(
      
        <div className="Layout">
          <SearchContextProvider>
            <CompareContextProvider>
              <CategoriesContextProvider>
                <ChatContextProvider>
                  <Navbar/>
                  <Outlet/>
                  <Footer/>
                </ChatContextProvider>
              </CategoriesContextProvider>
            </CompareContextProvider>
          </SearchContextProvider>
        </div>
    )
  }
  
  const ProtectedRoute = ({children})=>{
    

    if(currentUser){
      return children
    }
    return <Navigate to="/login"/>
  }

  const ProtectedRoute1 = ({children})=>{
    
    if(currentUser.id.includes('C')){
      return children
    }
    return <Navigate to="/up"/>
  }

  const ProtectedRoute2 = ({children})=>{
    
    if(currentUser.id.includes('V')){
      return children
    }
    return <Navigate to="/up"/>
  }

  const ProtectedRoute3 = ({children})=>{
    
    if(currentUser.id.includes('A')){
      return children
    }
    return <Navigate to="/up"/>
  }
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><DefaultLayout/></ProtectedRoute>,
      children:[
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/products/:id",
          element: <Products />,
        },
        {
          path: "/product/:id",
          element: <SingleProduct/>,
        },
        {
          path: "/chat",
          element: <Chat/>,
        },
        {
          path: "/compare",
          element: <CompareProducts/>,
        },
        {
          path: "/up",
          element:
            <div className="up">
              <Sidebar/>
              <Outlet/>
            </div>,
          children:[
            {
              path: "/up/changepassword",
              element: <ChangePassword/>
            },
            {
              path: "/up",
              element: <ProtectedRoute1><Profile/></ProtectedRoute1>
            },
            {
              path: "/up/vendor",
              element: <ProtectedRoute2><VendorProfile/></ProtectedRoute2>
            },
            {
              path: "/up/admin",
              element: <ProtectedRoute3><Admin/></ProtectedRoute3>
            },
            {
              path: "/up/manageusers",
              element: <ProtectedRoute3><Users/></ProtectedRoute3>
            },
            {
              path: "/up/manageproducts",
              element: <ProtectedRoute3><ManageAllProducts/></ProtectedRoute3>
            },
            {
              path: "/up/bookmarks",
              element: <ProtectedRoute1><Bookmarks/></ProtectedRoute1>
            },
            {
              path: "/up/addproduct",
              element: <ProtectedRoute2><AddProduct/></ProtectedRoute2>
            },
            {
              path: "/up/manage",
              element: <ProtectedRoute2><ManageProducts/></ProtectedRoute2>
            },
            {
              path: "/up/reported",
              element: <ProtectedRoute2><ReportedProducts/></ProtectedRoute2>
            }
          ]
        }
      ]
    },
    {
      path: "/registration/",
      element: <RegistrationLayout/>,
      children:[
        {
          path: "/registration/",
          element: <UserRegistration/>
        },
        {
          path: "/registration/company",
          element: <CompanyRegistration/>
        }
      ]
    },
    {
      path: "/login",
      element: <Login/>,
    }
  ]);

  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}

export default App;