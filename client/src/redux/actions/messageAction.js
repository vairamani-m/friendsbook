import { deleteDataApi, getDataApi, postDataApi } from "../../utils/fetchData";
import { GLOBALTYPES, MESS_TYPES } from "../types/actionTypes"
import { DeleteData } from "./actionHelpers";

// export const addUser = ({user, message}) => async (dispatch) => {
//     if(message.users.every(item => item._id !== user._id)){
//         dispatch({ type: MESS_TYPES.ADD_USER, payload: {...user, text: '', media:[]} })
//     }
// }

export const addMessage = ({msg, auth, socket}) => async dispatch => {
    dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg })
    const { _id, avatar, fullname, username } = auth.user;
    socket.emit('addMessage', {...msg, user: { _id, avatar, fullname, username }})
    try {
        await postDataApi('message', msg, auth.token)
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}

export const getConversations = ({auth, page}) => async (dispatch) => {
    try {
        const res = await getDataApi(`conversations?limit=${page * 9}`, auth.token);
        let newArr = []
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if(cv._id !== auth.user._id){
                    newArr.push({...cv, text: item.text, media: item.media, call: item.call})
                }
            })
        })
        dispatch({type: MESS_TYPES.GET_CONVERSATIONS, payload: {newArr, result: res.data.result}})

    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}


export const getMessages = ({auth, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataApi(`message/${id}?limit=${page * 9}`, auth.token);
        const newData = {...res.data, messages: res.data.messages.reverse()}
        dispatch({ type: MESS_TYPES.GET_MESSAGES, payload:{...newData, _id: id, page} })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}

export const loadMoreMessages = ({auth, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataApi(`message/${id}?limit=${page * 9}`, auth.token);
        const newData = {...res.data, messages: res.data.messages.reverse()}
        dispatch({ type: MESS_TYPES.UPDATE_MESSAGES, payload:{...newData, _id: id, page} })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}

export const deleteMessages = ({msg, data, auth}) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)
    dispatch({ type: MESS_TYPES.DELETE_MESSAGES, payload:{ newData, _id: msg.recipient } })
    try {
        await deleteDataApi(`message/${msg._id}`, auth.token);
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}

export const deleteConversation = ({auth, id}) => async (dispatch) => {
    dispatch({ type: MESS_TYPES.DELETE_CONVERSATION, payload: id })
    try {
        await deleteDataApi(`conversation/${id}`, auth.token);
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}