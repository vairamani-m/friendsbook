import React from 'react'
import { Route, Outlet, Navigate } from 'react-router-dom'


// This method working Version5 react-router-dom
// const PrivateRouter = (props) => {
//     console.log('privateRouter', props);
//     const firstLogin = localStorage.getItem('firstLogin')
//     return firstLogin ? <Route {...props} /> : <Navigate to="/" replace />
// }



// if we using this route in app.js go with render children in private router;
// <Route exact path='/:page/:id' 
//             element={
//                 <PrivateRouter>
//                  <PageRender />
//                 </PrivateRouter>
//             }
//         /> 

// <Route  exact path='/:page' 
//                 element={
//                   <PrivateRouter>
//                     <PageRender />
//                   </PrivateRouter>
//                 }
//        /> 

// const PrivateRouter = ({ children }) => {

//     const firstLogin = localStorage.getItem('firstLogin')

//     return firstLogin ? children : <Navigate to="/" replace />
// }


// if you using this route in app.js go with render Outlet in private router;

{/* <Route element={<PrivateRouter />}>
        <Route element={<PageRender />} exact path='/:page/:id' />
        <Route element={<PageRender />} exact path='/:page' />
    </Route> */}

const PrivateRouter = () => {
    
    const firstLogin = localStorage.getItem('firstLogin')

    return firstLogin ? <Outlet /> : <Navigate to="/" replace />
}


export default PrivateRouter
