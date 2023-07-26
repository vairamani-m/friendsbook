import { GLOBALTYPES } from "../types/actionTypes";


const statusReducers = (state = false, action) => {
    switch(action.type){
        case GLOBALTYPES.STATUS:
            return action.payload
        default:
            return state;
    }
}

export default statusReducers