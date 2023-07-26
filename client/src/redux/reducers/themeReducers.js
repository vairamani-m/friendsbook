import { GLOBALTYPES } from "../types/actionTypes";

const initialState = false

const themeReducers = (state = initialState, action) => {
    switch(action.type){
        case GLOBALTYPES.THEME:
            return action.payload
        default:
            return state;
    }
}

export default themeReducers