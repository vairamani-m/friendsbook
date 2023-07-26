import { GLOBALTYPES } from "../types/actionTypes";

const initialState = {}

const authReducers = (state = initialState, action) => {
    switch(action.type){
        case GLOBALTYPES.AUTH:
            return action.payload
        default:
            return state;
    }
}

export default authReducers