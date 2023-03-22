import {Outlet} from "react-router-dom";

import "./register.scss"

const CompanyRegistration = () => {
  return (
    <div className='register'>
      <div className="regCard">
        <Outlet/>
      </div>
    </div>
  )
}

export default CompanyRegistration