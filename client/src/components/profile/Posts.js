import React, { useEffect, useState } from 'react'
import PostThumb from '../PostThumbb'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataApi } from '../../utils/fetchData'
import { PROFILE_TYPES } from '../../redux/types/actionTypes'

const Posts = ({ auth, id, dispatch, profile }) => {
  const [posts, setPosts] = useState([])
  const [result, setResult] = useState(9)
  const [page, setPage] = useState(0)
  const [load, setLoad] = useState(false)

  useEffect(()=>{
    profile.userPosts.forEach(data =>{
      if(data._id === id){
        setPosts(data.posts)
        setResult(data.result)
        setPage(data.page)
      }
    })
  },[profile.userPosts, id])

  const handleLoadMore = async () => {
    setLoad(true)
    const res = await getDataApi(`user_posts/${id}?limit=${page * 9}`, auth.token)
    const newData = {...res.data, page: page+1, _id: id}
    dispatch({ type:PROFILE_TYPES.UPDATE_POSTS, payload: newData })
    setLoad(false)
  }

  return (
    <div>
      <PostThumb posts={posts} result={result} />

        {
          load && <img src={LoadIcon} alt="loading" className='d-block mx-auto' />
        }
        <LoadMoreBtn result={result} page={page} load={load} handleLoadMore={handleLoadMore} />
    </div>
  )
}

export default Posts
