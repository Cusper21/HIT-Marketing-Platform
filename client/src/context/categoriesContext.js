import { createContext} from "react";
import useState from 'react-usestateref'
import { makeRequest } from "../axios";

export const CategoriesContext = createContext()

export const CategoriesContextProvider = ({children}) =>{
    const [categories, setCategories] = useState(null);
    const [subCategories, setSubCategories] = useState(null);

    const cat = async ()=>{
        const res = await makeRequest.get("/categories/all");
        setCategories(res.data)
    }

    const scat = async (category_sfk)=>{
        const res = await makeRequest.post("/categories/subcategories", category_sfk);
        setSubCategories(res.data)
    }

    return <CategoriesContext.Provider value={{cat,scat, categories, subCategories}}>
        {children}
    </CategoriesContext.Provider>
}