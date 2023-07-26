import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDataApi } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/types/actionTypes'
import UserCard from '../UserCard'
import LoadIcon from '../../images/loading.gif'

const Search = () => {
    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [load, setLoad] = useState(false)

    const handleClose = () => {
        setSearch("");
        setUsers([])
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!search) return;

        try {
            setLoad(true)
            const res = await getDataApi(`search?username=${search}`, auth.token)
            setUsers(res.data.users)
            setLoad(false)
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: error.response.data.message }
            })
        }
    }

  return (
    <form className='search_form' onSubmit={handleSearch}>
        <input type="text" name="search" value={search} id="search"
        onChange={e => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))} autoComplete="off"  title='Enter to Search'/>
        
        <div className="search_icon" style={{ opacity : search ? 0 : 0.3 }}>
            <span className='material-icons'>search</span>
            <span>Enter to Search</span>
        </div>
        {load && <img className='loading' src={LoadIcon} alt="loading" />}
        <div className="close_search" 
        style={{opacity: users.length === 0 ? 0 : 1}}
        onClick={handleClose}
        >
            &times;
        </div>
        <button type='submit' style={{display:'none'}}>Search</button>
        <div className='users'>
            {
               search && users.map(user => (
                    <UserCard 
                        key={user._id} 
                        user={user} 
                        border="border"
                        handleClose={handleClose}
                    />
                ))
            }
        </div>
    </form>
  )
}

export default Search
