import { GLOBALTYPES, POST_TYPES } from "../types/actionTypes";
import { postDataApi, patchDataApi, deleteDataApi } from "../../utils/fetchData";
import { EditData, DeleteData } from "./actionHelpers";
import { createNotify, removeNotify } from "./notifyActions";

export const createComment =  ({post, newComment, auth, socket}) => async (dispatch) => {
    const newPost = { ...post, comments:[...post.comments, newComment]}
    dispatch({ type:POST_TYPES.UPDATE_POST, payload: newPost })
    try {
        const data = {...newComment, postId: post._id, postUserId: post.user._id}
        // dispatch({ type:GLOBALTYPES.ALERT, payload: { loading: true } })
        const res = await postDataApi('comment', data, auth.token) 

        const newData = { ...res.data.newComment, user: auth.user }

        const newPost = { ...post, comments:[...post.comments, newData] }

        dispatch({ type:POST_TYPES.UPDATE_POST, payload: newPost })

        // Socket
        socket.emit('createComment', newPost)
         // Notify
         const msg = {
            id: res.data.newComment._id,
            text: newComment.reply ? 'mentioned you in a comment.': 'has commented on your post.',
            recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
            url:`/post/${post._id}`,
            content: post.content,
            image: post.images[0].url
        }
        dispatch(createNotify({msg, auth, socket}))

        // dispatch({ type:GLOBALTYPES.ALERT, payload: { loading: false } })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}

export const updateComment =  ({comment, post, content, auth}) => async (dispatch) => {

    const newComments = EditData(post.comments, comment._id, {...comment, content})

    const newPost = {...post, comments: newComments}

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
    try {
        patchDataApi(`comment/${comment._id}`, {content}, auth.token)
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}

export const likeComment =  ({comment, post, content, auth}) => async (dispatch) => {
    const newComment = {...comment, likes:[...comment.likes, auth.user]}

    const newComments = EditData(post.comments, comment._id, newComment)

    const newPost = {...post, comments: newComments}

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
    try {
        patchDataApi(`comment/${comment._id}/like`, null, auth.token)
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }

}

export const unLikeComment =  ({comment, post, content, auth}) => async (dispatch) => {
    const newComment = {...comment, likes: DeleteData(comment.likes, auth.user._id)}

    const newComments = EditData(post.comments, comment._id, newComment)

    const newPost = {...post, comments: newComments}

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
    try {
        patchDataApi(`comment/${comment._id}/unlike`, null, auth.token)
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }

}

export const deleteComment = ({post, auth, comment, socket}) => async (dispatch) => {
    const deleteArr = [...post.comments.filter(cm => cm.reply === comment._id), comment]
    const newPost = {
        ...post,
        comments: post.comments.filter(cm => !deleteArr.find(da => cm._id === da._id))
    }
    // Socket
    socket.emit('deleteComment', newPost)
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
    try {
        deleteArr.forEach(item => {
            deleteDataApi(`comment/${item._id}`, auth.token)
            
            // Notify
            const msg = {
                id: item._id,
                text: comment.reply ? 'mentioned you in a comment.': 'has commented on your post.',
                recipients: comment.reply ? [comment.tag._id] : [post.user._id],
                url:`/post/${post._id}`,
            }
            dispatch(removeNotify({msg, auth, socket}))
        })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }

}