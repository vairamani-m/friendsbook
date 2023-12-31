import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDiscoverPost } from '../redux/actions/discoverActions'
import LoadIcon from '../images/loading.gif'
import PostThumb from '../components/PostThumbb'
import LoadMoreBtn from '../components/LoadMoreBtn'
import { getDataApi } from '../utils/fetchData'
import { DISCOVER_TYPES } from '../redux/types/actionTypes'


const Discover = () => {
  const { auth, discover } = useSelector(state =>  state)
  const dispatch = useDispatch()

  const [load, setLoad] = useState(false)

  useEffect(()=>{
    if(!discover.firstLoad){
      dispatch(getDiscoverPost(auth.token))
    }
  },[dispatch, auth.token, discover.firstload])

  const handleLoadMore = async () => {
    setLoad(true)
    const res = await getDataApi(`post_discover?num=${discover.page * 9}`, auth.token)
    dispatch({ type:DISCOVER_TYPES.UPDATE_POST, payload: res.data })
    setLoad(false)
  }

  return (
    <div>
        {
          discover.loading 
          ? <img src={LoadIcon} alt="loading" className='d-block mx-auto my-4' />
          : <PostThumb posts={discover.posts} result={discover.result} />

        }
        {
          load && <img src={LoadIcon} alt="loading" className='d-block mx-auto' />
        }
        { 
          !discover.loading &&
          <LoadMoreBtn result={discover.result} page={discover.page} load={load} handleLoadMore={handleLoadMore} />
        }
    </div>
  )
}

export default Discover
