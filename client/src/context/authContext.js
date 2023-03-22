import { createContext, useEffect } from "react";
import useState from 'react-usestateref'
import { makeRequest } from "../axios";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) =>{
    const [currentUser, setcurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (inputs)=>{
        const res = await makeRequest.post("auth/login", inputs);
        setcurrentUser(res.data)
    }

    const logout = async ()=>{
        await makeRequest.post("auth/logout");
        setcurrentUser(null)
    }

    useEffect((e)=>{
        localStorage.setItem("user", JSON.stringify(currentUser))
    },[currentUser])

    return <AuthContext.Provider value={{currentUser, login, logout}}>
        {children}
    </AuthContext.Provider>
}