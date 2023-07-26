import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../redux/actions/authActions'

const Register = () => {
  const initialState = { fullname:'', username:'', email:'', password:'', confirm_password:'', gender:'male' }
  const [userData, setUserData] = useState(initialState)
  const { fullname, username, email, password, confirm_password } = userData
  const [showPassword, setShowPassword] = useState(false)
  const [cfShowPassword, setCfShowPassword] = useState(false)
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
    dispatch(register(userData))
  }

 
  return (
    <div className='auth_page'>
      <form onSubmit={handleSubmit}>
        <h3 className='text-center mb-4 text-secondary'><span className='text-dark display-4'>F</span>RIENDS<span className='text-dark display-4'>B</span>OOK</h3>
        <div className="form-group">
          <label htmlFor="fullName">Full name</label>
          <input type="text" name="fullname" className="form-control" id="fullName" onChange={handleChangeInput} value={fullname} style={{ background: `${alert.fullname ? '#fd2d6a14' : '' }`}} />
          <small className="form-text text-danger">
            { alert.fullname ? alert.fullname : '' }
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="username">User name</label>
          <input type="text" name="username" className="form-control" id="username" onChange={handleChangeInput} value={username.toLowerCase().replace(/ /g, '')} style={{ background: `${alert.username ? '#fd2d6a14' : '' }`}} />
          <small className="form-text text-danger">
            {alert.username ?  alert.username : ''}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" name="email" className="form-control" id="exampleInputEmail1" 
           onChange={handleChangeInput} value={email}  style={{ background: `${alert.email ? '#fd2d6a14' : '' }`}} />
          <small className="form-text text-danger">
            {alert.email ? alert.email  : ''}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className='pass'>
            <input 
              type={showPassword ? "text" : "password" } 
              name="password" className="form-control" 
              id="password"
              onChange={handleChangeInput} value={password}
              style={{ background: `${alert.password ? '#fd2d6a14' : '' }`}}
            />
            <small onClick={() => setShowPassword(!showPassword)}> 
            {/* { showPassword ? 'hide' : 'show' } */}
            { showPassword ?  <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i> }
            </small>
          </div>
            <small className="text-danger">
              {alert.password ? alert.password  : ''}
            </small>
        </div>
        <div className="form-group">
          <label htmlFor="confirm_password">Confirm Password</label>
          <div className='pass'>
            <input 
              type={cfShowPassword ? "text" : "password" } 
              name="confirm_password" className="form-control" 
              id="confirm_password"
              onChange={handleChangeInput} value={confirm_password} 
              style={{ background: `${alert.confirm_password ? '#fd2d6a14' : '' }`}}
            />
            <small onClick={() => setCfShowPassword(!cfShowPassword)}> 
            {/* { cfShowPassword ? 'hide' : 'show' } */}
            { cfShowPassword ?  <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i> }
            </small>
          </div>
            <small className="text-danger">
              {alert.confirm_password ? alert.confirm_password  : ''}
            </small>
        </div>
        <div className='row justify-content-between mx-0 mb-1'>
          <label htmlFor='male'>
            Male: <input type="radio" id="male" name="gender" value="male" defaultChecked onChange={handleChangeInput} />
          </label>

          <label htmlFor='female'>
            Female: <input type="radio" id="female" name="gender" value="female" onChange={handleChangeInput} />
          </label>

          <label htmlFor='others'>
            Others: <input type="radio" id="others" name="gender" value="female" onChange={handleChangeInput} />
          </label>
        </div>
        <button type="submit" className="btn btn-dark w-100">Register</button>
        <p className='my-2'>You already have an account? <Link to="/" style={{ color: "crimson" }}>Login Now</Link></p>
      </form>
    </div>
  )
}

export default Register
