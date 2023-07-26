import { combineReducers } from "redux";
import auth from "./authReducers";
import alert from "./alertReducers";
import theme from "./themeReducers";
import profile from "./profileReducers";
import status from "./statusReducers";
import homePosts from "./postReducers"
import modal from "./modalReducers"
import detailPost from "./detailPostReducers"
import discover from "./discoverReducers"
import suggestions from "./suggestionsReducers";
import socket from "./socketReducers";
import notify from "./notifyReducers";
import message from "./messageReducers";
import online from "./onlineReducers";
import call from "./callReducers";
import peer from "./peerReducers";

export default combineReducers({
    auth,
    alert,
    theme,
    profile,
    status,
    homePosts,
    modal,
    detailPost,
    discover,
    suggestions,
    socket,
    notify,
    message,
    online,
    call,
    peer
})