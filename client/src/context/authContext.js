import { createContext, useEffect } from "react";
import useState from 'react-usestateref'
import { makeRequest } from "../axios";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) =>{
    const [currentUser, setcurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const [isLoading, setIsLoading] = useState(false);

    const login = async (inputs)=>{
        setIsLoading(true);
        const res = await makeRequest.post("auth/login", inputs);
        setcurrentUser(res.data)
        setIsLoading(false);
    }

    const logout = async ()=>{
        await makeRequest.post("auth/logout");
        setcurrentUser(null)
    }

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentUser))
    },[currentUser])

    return <AuthContext.Provider value={{currentUser,setcurrentUser, login, logout}}>
        {isLoading ? ( children
        
      ) : (
        // render the child components when the loading is finished
        children
      )}
    </AuthContext.Provider>
}