import { GLOBALTYPES } from "../types/actionTypes";


const callReducers = (state = null, action) => {
    switch(action.type){
        case GLOBALTYPES.CALL:
            return action.payload
        default:
            return state;
    }
}

export default callReducers