import { GLOBALTYPES, DISCOVER_TYPES } from "../types/actionTypes";
import { getDataApi } from "../../utils/fetchData";

export const getDiscoverPost =  (token) => async (dispatch) => {
    try {
        dispatch({ type: DISCOVER_TYPES.LOADING, payload: true })
        const res = await getDataApi(`post_discover`, token)
        dispatch({ type: DISCOVER_TYPES.GET_POSTS, payload: res.data})
        dispatch({ type: DISCOVER_TYPES.LOADING, payload: false })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: error.response.data.message }
        })
    }
}