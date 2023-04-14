import { createContext } from "react";
import useState from 'react-usestateref';

export const CompareContext = createContext()

export const CompareContextProvider = ({children}) =>{

  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [popUp, setPopUp] = useState(false);

  return <CompareContext.Provider value={{product1, setProduct1,product2, setProduct2, popUp, setPopUp}}>
      {children}
  </CompareContext.Provider>
}