import { GLOBALTYPES } from "../types/actionTypes"
import { postDataApi } from "../../utils/fetchData"
import validation from "../../utils/validation"


export const login = (data) =>  async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
        const res = await postDataApi('login', data)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: { 
                token: res.data.access_token, 
                user:res.data.user
            } 
        })
        localStorage.setItem('firstLogin', true)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { 
                success: res.data.message 
            } 
        })
    } catch (error) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { 
                error: error.response.data.message 
            } 
        })
    }
    setTimeout(()=>{
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {} 
        })
    }, 3000)
}

export const register = (data) =>  async (dispatch) => {
    const checkIsValid = validation(data)
    if(checkIsValid.errorLength > 0)
    return  dispatch({ type:GLOBALTYPES.ALERT, payload: checkIsValid.errorMsg })

    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: { loading: true }})
        const res = await postDataApi('register', data)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: { 
                token: res.data.access_token, 
                user:res.data.user
            } 
        })
        localStorage.setItem('firstLogin', true)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { 
                success: res.data.message 
            } 
        })

    } catch (error) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { 
                error: error.response.data.message 
            } 
        })
    }
}


export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem('firstLogin')
    if(firstLogin){
        dispatch({ type:GLOBALTYPES.ALERT, payload:{ loading: true }})
        try {
            const res = await postDataApi('refresh_token')
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload: { 
                    token: res.data.access_token, 
                    user:res.data.user
                } 
            })
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {} 
            })
        } catch (error) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { 
                    error: error.response.data.message 
                } 
            })
        }
    }
}

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('firstLogin')
        await postDataApi('logout')
        window.location.href = "/"
    } catch (error) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { 
                error: error.response.data.message 
            } 
        })
    }
}