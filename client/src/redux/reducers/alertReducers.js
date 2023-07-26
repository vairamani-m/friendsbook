import { GLOBALTYPES } from "../types/actionTypes";

const initialState = {}

const alertReducers = (state = initialState, action) => {
    switch(action.type){
        case GLOBALTYPES.ALERT:
            return action.payload
        default:
            return state;
    }
}

export default alertReducers