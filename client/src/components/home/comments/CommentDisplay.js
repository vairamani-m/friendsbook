import React, { useState, useEffect } from 'react'
import CommentCard from './CommentCard'

const CommentDisplay = ({ comment, post, replyCmts }) => {

  const [showReply, setShowReply] = useState([])
  const [next, setNext] = useState(1)

  useEffect(()=>{
    setShowReply(replyCmts.slice(replyCmts.length - next))
  },[replyCmts, next])

  return (
    <div className='comment_display'>
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div className='pl-4'>
          {
            showReply.map((replyCmt, index) => (
              replyCmt.reply &&
              <CommentCard 
                key={index}
                comment={replyCmt}
                post={post}
                commentId={comment._id}
              />
            ))
          }
          {
            replyCmts.length - next > 0 
            ?
            <div style={{ cursor:'pointer', color:'crimson' }} onClick={()=>setNext(next + 10)}>
              See more comments...
            </div>
            :
            replyCmts.length > 2 &&
            <div style={{ cursor:'pointer', color:'crimson' }} onClick={()=>setNext(1)}>
              Hide comments...
            </div>
          }
        </div>
      </CommentCard>
    </div>
  )
}

export default CommentDisplay
