import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../redux/actions/authActions'
import { useDispatch, useSelector } from 'react-redux'

const Login = () => {
  const initialState = { email:'', password:'' }
  const [userData, setUserData] = useState(initialState)
  const { email, password } = userData
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { auth, alert } = useSelector(state => state)

  useEffect(()=>{
    if(auth.token) navigate("/", { replace: true })

  },[auth.token, navigate])

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]:value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(userData))
  }

  return (
    <div className='auth_page'>
      <form onSubmit={handleSubmit}>
        <h3 className='text-center mb-4 text-secondary'><span className='text-dark display-4'>F</span>RIENDS<span className='text-dark display-4'>B</span>OOK</h3>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" name="email" className="form-control" id="exampleInputEmail1" 
          aria-describedby="emailHelp" placeholder="Enter email" onChange={handleChangeInput} value={email} />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <div className='pass'>
            <input 
              type={showPassword ? "text" : "password" } 
              name="password" className="form-control" 
              id="exampleInputPassword1" placeholder="Password" 
              onChange={handleChangeInput} value={password} 
            />
            <small onClick={() => setShowPassword(!showPassword)}> 
            {/* { showPassword ? 'hide' : 'show' } */}
            {/* { showPassword ?  <span className='material-icons'>{'visibility'}</span> : <span className='material-icons'>{'visibility_off'}</span> } */}
            { showPassword ?  <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i> }
            </small>
          </div>
        </div>
        <button type="submit" className="btn btn-dark w-100" disabled={email && password ? false : true}>Login</button>
        <p className='my-2'>You don't have an account? <Link to="/register" style={{ color: "crimson" }}>Register Now</Link></p>
      </form>
    </div>
  )
}

export default Login
