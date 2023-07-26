import { GLOBALTYPES, SUGGES_TYPES } from "../types/actionTypes";
import { getDataApi } from "../../utils/fetchData";

export const getSuggestions = (token) => async (dispatch) => {
    try {
        dispatch({  type:SUGGES_TYPES.LOADING,  payload: true })
        const res =  await getDataApi('suggestionsUser', token)
        dispatch({  type:SUGGES_TYPES.GET_USERS,  payload: res.data })
        dispatch({  type:SUGGES_TYPES.LOADING,  payload: false })
    } catch (error) {
        dispatch({ 
            type:GLOBALTYPES.ALERT, 
            payload:{error: error.response.data.message}
        })
    }
}