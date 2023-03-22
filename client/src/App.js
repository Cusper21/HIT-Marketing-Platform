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

import "./app.scss";
import Profile from "./pages/profile/Profile";
import AddProduct from "./pages/addProduct/AddProduct";
import ManageProducts from "./pages/manageProducts/ManageProducts";
import ReportedProducts from "./pages/reportedProducts/ReportedProducts";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { SearchContextProvider } from './context/searchContext';
import { ChatContextProvider } from "./context/chatContext";

function App() {

  const queryClient = new QueryClient()
  
  const RegistrationLayout = () =>{
    return(
      <Register/>
    )
  }
  
  const DefaultLayout = () =>{
    return(
      <QueryClientProvider client={queryClient}>
        <div className="Layout">
          <SearchContextProvider>
            <ChatContextProvider>
              <Navbar/>
              <Outlet/>
              <Footer/>
            </ChatContextProvider>
          </SearchContextProvider>
        </div>
      </QueryClientProvider>
    )
  }
  
  const ProtectedRoute = ({children})=>{
    const {currentUser} = useContext(AuthContext)

    if(currentUser){
      return children
    }
    return <Navigate to="/login"/>
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
          path: "/chat/:id",
          element: <Chat/>,
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
              path: "/up/:id",
              element: <Profile/>
            },
            {
              path: "/up/addproduct",
              element: <AddProduct/>
            },
            {
              path: "/up/manage",
              element: <ManageProducts/>
            },
            {
              path: "/up/reported",
              element: <ReportedProducts/>
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
      <RouterProvider router={router} />
    </div>
  );
}

export default App;