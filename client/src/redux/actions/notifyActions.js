import { GLOBALTYPES, NOTIFY_TYPES } from "../types/actionTypes";
import { postDataApi, deleteDataApi, getDataApi, patchDataApi } from "../../utils/fetchData";

export const createNotify =  ({msg, auth, socket}) => async (dispatch) => {
    try {
        const res = await postDataApi('notify', msg, auth.token)
        socket.emit('createNotify', {
            ...res.data.notify,
            user: {
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        })
    } catch (error) {
        dispatch({type:GLOBALTYPES.ALERT, payload: {error: error.response.data.message}})
    }
}

export const removeNotify =  ({msg, auth, socket}) => async (dispatch) => {
    try {
        await deleteDataApi(`notify/${msg.id}?url=${msg.url}`, auth.token)
        socket.emit('removeNotify', msg)
    } catch (error) {
        dispatch({type:GLOBALTYPES.ALERT, payload: {error: error.response.data.message}})
    }
}

export const getNotifies =  (token) => async (dispatch) => {
    try {
        const res = await getDataApi('notifies', token)
        dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies })
    } catch (error) {
        dispatch({type:GLOBALTYPES.ALERT, payload: {error: error.response.data.message}})
    }
}

export const isReadNotify =  ({msg, auth}) => async (dispatch) => {
    try {
        dispatch({ type: NOTIFY_TYPES.UPDATE_NOTIFY, payload: {...msg, isRead: true} })
        await patchDataApi(`isReadNotify/${msg._id}`, null, auth.token)
    } catch (error) {
        dispatch({type:GLOBALTYPES.ALERT, payload: {error: error.response.data.message}})
    }
}

export const deleteAllNotifies =  (token) => async (dispatch) => {
    dispatch({ type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES, payload: []})
    try {
        await deleteDataApi('deleteAllNotify', token)
    } catch (error) {
        dispatch({type:GLOBALTYPES.ALERT, payload: {error: error.response.data.message}})
    }
}