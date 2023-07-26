import { GLOBALTYPES } from "../types/actionTypes";


const peerReducers = (state = null, action) => {
    switch(action.type){
        case GLOBALTYPES.PEER:
            return action.payload
        default:
            return state;
    }
}

export default peerReducers