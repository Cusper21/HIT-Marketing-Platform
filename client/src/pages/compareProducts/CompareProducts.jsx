import React, { useContext} from 'react'
import './compareProducts.scss'
import { CompareContext } from '../../context/compareContext'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Compare from '../../components/comparePopUp/Compare';

const CompareProducts = () => {
    const {product1,product2, popUp, setPopUp} = useContext(CompareContext)

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
    console.log(product1,product2,mergedArray)

  return (
    <div className='compareProducts'>
        <div className="header">
            <h3>Compare Products</h3>
        </div>
        <div className="container">
            <div className="image">
                <img src={"../productImages/"+product1?.image1} alt='' className='img' />
                <img src={"../productImages/"+product2?.image1} alt='' className='img'/>
            </div>
            {
                mergedArray?.map((key) => {
                return ( <div className="attribute" key={key}>
                    <h4 className='key'>{key}</h4>
                    <hr class="hr-text" data-content={key}/>
                    <div className="details">
                        {product1 ? <span>{product1[key]}</span> : <span>-</span>}
                        {product2 ? <span>{product2[key]}</span> : <span>-</span>}
                    </div>
                </div>)
                })
            }
            <div className="buttons">
                {!product1 && <AddCircleRoundedIcon onClick={() => togglePopUp()}/>}
                {!product2 && <AddCircleRoundedIcon onClick={() => togglePopUp()}/>}
            </div>
            {
                popUp && <Compare/>
            }
        </div>
    </div>
  )
}

export default CompareProducts