import { PROFILE_TYPES, GLOBALTYPES } from "../types/actionTypes";
import { getDataApi, patchDataApi } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
import { DeleteData } from "./actionHelpers";
import { createNotify, removeNotify } from "./notifyActions";

export const getProfileUsers = ({ users, id, auth }) => async (dispatch) => {
        dispatch({type:PROFILE_TYPES.GET_ID, payload:id})
        try {
            dispatch({ type: PROFILE_TYPES.LOADING, payload:true })
            const res = getDataApi(`user/${id}`, auth.token)
            const res1 = await getDataApi(`user_posts/${id}`, auth.token)
            const users = await res;
            const posts = await res1;

            dispatch({ 
                type: PROFILE_TYPES.GET_USER, 
                payload:users.data
            })
            dispatch({ 
                type: PROFILE_TYPES.GET_POSTS, 
                payload: {...posts.data, _id: id, page:2 }
            })
            dispatch({ type: PROFILE_TYPES.LOADING, payload:false })
        } catch (error) {
            dispatch({ 
                type: GLOBALTYPES.ALERT,        
                payload:{ error: error.response.data.message } 
            })
        }
}

export const updateProfileuser = ({ userData, avatar, auth }) => async (dispatch) => {
        if(!userData.fullname){
            return dispatch({ type: GLOBALTYPES.ALERT, payload:{ error :'Please add your full name.'} })
        }
        if(userData.fullname.length > 25){
            return dispatch({ type: GLOBALTYPES.ALERT, payload:{ error :'Your full name too long.'} })
        }
        if(userData.story.length > 200){
            return dispatch({ type: GLOBALTYPES.ALERT, payload:{ error :'Your story name too long.'} })
        }

        try {
            let media;
            dispatch({ type:GLOBALTYPES.ALERT, payload:{loading: true}})
            if(avatar) media = await imageUpload([avatar])
            const res = await patchDataApi("user", {
                ...userData,
                avatar: avatar ? media[0].url : auth.user.avatar
            }, auth.token)

            dispatch({
                type:GLOBALTYPES.AUTH,
                payload: {
                    ...auth,
                    user: {
                        ...auth.user,
                        ...userData,
                        avatar: avatar ? media[0].url : auth.user.avatar
                    }
                }
            })

            dispatch({ type:GLOBALTYPES.ALERT, payload:{success: res.data.message}})
        } catch (error) {
            dispatch({ 
                type:GLOBALTYPES.ALERT, 
                payload:{error: error.response.data.message}
            })
        }
}   

export const followUser = ({ users, user, auth, socket }) => async (dispatch) => {
    let newUser;  
    
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers:[...user.followers, auth.user]};
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers:[...item.followers, auth.user]};
            }
        })
    }
    dispatch({
        type:PROFILE_TYPES.FOLLOW,
        payload: newUser
    })

    dispatch({
        type:GLOBALTYPES.AUTH,
        payload: {
            ...auth,
            user:{...auth.user, following: [...auth.user.following, newUser]}
        }
    })
    

    try {
        const res = await patchDataApi(`user/${user._id}/follow`, null, auth.token)
        socket.emit('follow', res.data.newUser)

        
        // Notify
        const msg = {
            id: auth.user._id,
            text:'has started to follow you.',
            recipients: [newUser._id],
            url:`/profile/${auth.user._id}`
        }
        dispatch(createNotify({msg, auth, socket}))
    } catch (error) {
        dispatch({ 
            type:GLOBALTYPES.ALERT, 
            payload:{error: error.response.data.message}
        })
    }
}

export const unfollowUser = ({ users, user, auth, socket }) => async (dispatch) => {
    // const newUser = {
    //     ...user, 
    //     followers: user.followers.filter(item => item._id !== auth.user._id)
    // }
    let newUser;  

    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers:DeleteData(user.followers, auth.user._id)};
    }else{ 
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers:DeleteData(item.followers, auth.user._id)};
            }
        })
    }
    dispatch({
        type:PROFILE_TYPES.UNFOLLOW,
        payload: newUser 
    })
    dispatch({
        type:GLOBALTYPES.AUTH,
        // payload: {
        //     ...auth,
        //     user:{...auth.user, following: auth.user.following.filter(item => item._id !== newUser._id)}
        // }
        payload: {
            ...auth,
            user:{...auth.user, following: DeleteData(auth.user.following, newUser._id)}
        }
    })
    
    try {
        const res = await patchDataApi(`user/${user._id}/unfollow`, null, auth.token)
        socket.emit('unFollow', res.data.newUser)
        // Notify
        const msg = {
            id: auth.user._id,
            text:'has started to follow you.',
            recipients: [newUser._id],
            url:`/profile/${auth.user._id}`
        }
        dispatch(removeNotify({msg, auth, socket}))
    } catch (error) {
        dispatch({ 
            type:GLOBALTYPES.ALERT, 
            payload:{error: error.response.data.message}
        })
    }
}