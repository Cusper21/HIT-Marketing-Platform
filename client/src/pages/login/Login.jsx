import "./login.scss"
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Login = () => {

  const {login} = useContext(AuthContext)
  const [err, setErr] = useState(null)
  const navigate = useNavigate()

  const [inputs, setInputs] = useState({
    username:"",
    password:""
  })

  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  const handleLogin = (e)=> {
    e.preventDefault()

    try {
      
      login(inputs).then(()=> {
        navigate("/")
      })

    } catch (err) {
      setErr(err.response.data)
    }
  }

  return (
    <div className="login">
      <div className="lgcard">

        <div className="left">
          <h1>
            HIT Marketing Platform.
          </h1>
          <Link className="link" to="/registration/">
              Create Account
          </Link>
          <Link className="link" to="/registration/company"> 
              Register Company
          </Link>
        </div>

        <div className="lgright">
          <h2>
            Login
          </h2>

          <form action="">
            <input type="text" placeholder="Enter Username" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Enter Password" name="password" onChange={handleChange}/>
            
            <div>
              {err && err}
              <button onClick={handleLogin}>
                Submit
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  )
}

export default Login