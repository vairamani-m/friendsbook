import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/types/actionTypes'
import { checkImage } from '../../utils/imageUpload'
import { updateProfileuser } from '../../redux/actions/profileActions'

const EditProfile = ({setOnEdit}) => {
    const initialState = {
        fullname:'',
        mobile:'',
        address:'',
        website:'',
        story:'',
        gender:''
    }
    const [userData, setUserData] = useState(initialState)
    const [avatar, setAvatar] = useState('')
    const { fullname, mobile, address, website, story, gender } = userData;
    const { auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData(auth.user)
    },[auth.user])

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        const err = checkImage(file)
        if(err) return dispatch({
            type:GLOBALTYPES.ALERT, payload:{ error : err }
        })

        setAvatar(file)
    }
    const handleInput = e => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]:value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfileuser({userData, avatar, auth}))

    }
  return (
    <div className='edit_profile'>
      <button className='btn btn-danger btn_close' 
        onClick={()=>setOnEdit(false)}>
            Close
        </button>
        <form onSubmit={handleSubmit}>
            <div className='info_avatar'>
                <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar } 
                alt="avatar" style={{ filter: theme ? 'invert(1)' : 'invert(0)'}} />
                <span>
                    <i className='fas fa-camera' />
                    <p>Change</p>
                    <input type="file" name="file" id="file_up" accept="image/*" onChange={changeAvatar} />
                </span>
            </div>
            <div className='form-group'>
                <label htmlFor="fullname">Full Name</label>
                <div className='position-relative'>
                    <input type="text" className="form-control" id="fullname" name="fullname" onChange={handleInput} value={fullname} />
                    <small className='text-danger position-absolute' style={{ top:'50%', right:'5px', transform:'translateY(-50%)'}}>{fullname.length}/25</small>
                </div>
            </div>
            <div className='form-group'>
                <label htmlFor='mobile'>Mobile</label>
                <input className="form-control" id="mobile" type="text" name="mobile" value={mobile} onChange={handleInput} />
            </div>
            <div className='form-group'>
                <label htmlFor='address'>Address</label>
                <input className="form-control" id="address" type="text" name="address" value={address} onChange={handleInput} />
            </div>
            <div className='form-group'>
                <label htmlFor='website'>Website</label>
                <input className="form-control" id="website" type="text" name="website" value={website} onChange={handleInput} />
            </div>
            <div className='form-group'>
                <label htmlFor='story'>Story</label>
                <textarea className="form-control" id="story" type="text" name="story" value={story} cols="30" rows="4" onChange={handleInput} />
                    <small className='text-danger d-block text-right'>{story.length}/200</small>
            </div>
            <label htmlFor='gender'>Gender</label>
            <div className='input-group-prepend px-0 mb-4'>
                <select name="gender" id="gender" className='custom-select text-capitalize' value={gender} onChange={handleInput}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <button className='btn btn-info w-100' type='submit'>Save</button>
        </form>
    </div>
  )
}

export default EditProfile
