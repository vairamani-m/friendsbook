import { GLOBALTYPES } from "../types/actionTypes";


const onlineReducers = (state = [], action) => {
    switch(action.type){
        case GLOBALTYPES.ONLINE:
            return [...state, action.payload]
        case GLOBALTYPES.OFFLINE:
            return state.filter(item => item !== action.payload)
        default:
            return state;
    }
}

export default onlineReducers