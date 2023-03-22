import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const SearchContext = createContext()

export const SearchContextProvider = ({children}) =>{

    const [searchText, setSearchText] = useState(null);

    const lo = useParams().id

    useEffect(() => {
        setSearchText(null);
    }, [lo,setSearchText]);

    return <SearchContext.Provider value={{searchText, setSearchText}}>
        {children}
    </SearchContext.Provider>
}