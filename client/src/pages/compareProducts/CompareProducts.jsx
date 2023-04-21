import React, { useContext} from 'react'
import './compareProducts.scss'
import { CompareContext } from '../../context/compareContext'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Compare from '../../components/comparePopUp/Compare';

const CompareProducts = () => {
    const {product1,product2,setProduct1,setProduct2, popUp, setPopUp} = useContext(CompareContext)

    var mergedArray = [];
    
    if (!product1 && !product2) {
        mergedArray = []
    } else if (!product1) {
        mergedArray = Object.keys(product2)
    } else if (!product2) {
        mergedArray = Object.keys(product1)
    } else {
        mergedArray = [...Object.keys(product1), ...Object.keys(product2)].reduce((accumulator, currentValue) => {
        if (!accumulator.includes(currentValue)) {
            accumulator.push(currentValue);
        }
        return accumulator;
        }, []);
    }

    const togglePopUp = () =>{
        setPopUp(!popUp)
    }
    const handleClear = () =>{
        setProduct1({})
        setProduct2({})
    }

  return (
    <div className='compareProducts'>
        <div className="header">
            <h3>Get the value out of every Product!</h3>
        </div>
        <div className="container">
            <div className="images">
                <div className="image">                   
                    <img src={product1?.image1} alt='' className='img' />
                </div>
                <div className="image">
                    <img src={product2?.image1} alt='' className='img'/>
                </div>
            </div>
            
            <div className="buttons">
                <div className="button">
                    <AddCircleRoundedIcon onClick={() => togglePopUp()}/>
                </div>
                <button onClick={handleClear}> clear </button>
                <div className="button">
                    <AddCircleRoundedIcon onClick={() => togglePopUp()}/>
                </div>
            </div>

            {
                mergedArray?.map((key) => {

                    const a=["image1","date_added"];

                    if (a.includes(key)) {
                        return null;
                      }

                return ( <div className="attribute" key={key}>
                    <hr class="style-eight"  data-content={key}/>
                    <div className="details">
                        {product1 ? <span>{product1[key]}</span> : <span> — </span>}
                        {product2 ? <span>{product2[key]}</span> : <span> — </span>}
                    </div>
                </div>)
                })
            }
            
            {
                popUp && <Compare/>
            }
        </div>
    </div>
  )
}

export default CompareProducts