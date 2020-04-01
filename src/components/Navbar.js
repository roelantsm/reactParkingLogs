import React from 'react'

import { NavLink } from 'react-router-dom'; 

// import Home from './Pages/Home';
// import Billing from './Pages/Billing';
// import Post from './Pages/Post';

const  Navbar = () => {
    
    return (
        <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/overzicht">overzicht</NavLink>
            <NavLink to="/billing">billing</NavLink>
            <NavLink to="/post">Post</NavLink>
        </div>
    )
}

export default Navbar;
