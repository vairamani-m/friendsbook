import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageRender from './customRouter/PageRender';
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Alert from './components/alert/Alert';
import Header from './components/header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { refreshToken } from './redux/actions/authActions';
import PrivateRouter from './customRouter/PrivateRouter';
import StatusModal from './components/StatusModal';
import { getPosts } from './redux/actions/postAction';
import { getSuggestions } from './redux/actions/suggestionsAction';
import { getNotifies } from './redux/actions/notifyActions';

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/types/actionTypes';
import SocketClient from './SocketClient';
import CallModal from './components/message/CallModal';
import Peer from 'peerjs'

function App() {
  const { auth, status, modal, call } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())
    const socket = io()
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
   if(auth.token){
    dispatch(getPosts(auth.token))
    dispatch(getSuggestions(auth.token))
    dispatch(getNotifies(auth.token))
   } 
  },[dispatch, auth.token])

  useEffect(()=>{ 
    if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {

  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
      }
    });
  }
  },[])

  useEffect(()=>{
    // const newPeer = new Peer(undefined, {
    //   host: '/', port: '3001'
    // })
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  },[dispatch])
  
  return (
    <>
    <input type="checkbox" id="theme" />
    <div className={`App ${( status || modal ) && 'mode'}`}>
      <div className='main'> 
      <Alert />
        <BrowserRouter>
         {auth.token && <Header />}
         {status && <StatusModal />}
         {auth.token && <SocketClient />}
         {call && <CallModal />}
          <Routes>
            <Route exact path='/' element={auth.token ? <Home/> : <Login />}/>
            <Route exact path='/register' element={<Register />}/> 
            <Route element={<PrivateRouter />}> 
              <Route element={<PageRender />} exact path="/:page/:id" />
              <Route element={<PageRender />} exact path="/:page" />
            </Route>
            {/*<Route 
                exact 
                 path='/:page' 
                 element={
                   <PrivateRouter>
                     <PageRender />
                   </PrivateRouter>
                 }
               />
             <Route 
                   exact 
                   path='/:page/:id' 
                   element={
                   <PrivateRouter>
                     <PageRender />
                   </PrivateRouter>
                 }
               /> */}
            {/* This method working V5 react-router-dom */}
            {/* <PrivateRouter exact path='/:page' element={<PageRender />} /> */}
          </Routes>
        </BrowserRouter>
       </div>
    </div>  
    </>
  );
}

export default App;
