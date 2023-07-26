import { GLOBALTYPES } from "../types/actionTypes";


const socketReducers = (state = [], action) => {
    switch(action.type){
        case GLOBALTYPES.SOCKET:
            return action.payload
        default:
            return state;
    }
}

export default socketReducers