import { GLOBALTYPES } from "../types/actionTypes";

const initialState = false

const modalReducers = (state = initialState, action) => {
    switch(action.type){
        case GLOBALTYPES.MODAL:
            return action.payload
        default:
            return state;
    }
}

export default modalReducers