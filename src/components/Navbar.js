import React from 'react'

import { NavLink } from 'react-router-dom'; 


// import Home from './Pages/Home';
// import Billing from './Pages/Billing';
// import Post from './Pages/Post';

const  Navbar = () => {
    
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark primary-color">

                <div class="collapse navbar-collapse" id="navbarNav">
                
                    <ul class="navbar-nav">

                        <li class="nav-item active">
                            <NavLink to="/">Home</NavLink>
                        </li>

                        <li class="nav-item">
                            <NavLink to="/overzicht">overzicht</NavLink>
                        </li>

                        <li class="nav-item">
                            <NavLink to="/billing">billing</NavLink>
                        </li>

                        <li class="nav-item">
                            {/* <NavLink to="/post">Post</NavLink> */}
                            <NavLink to="/events">Event</NavLink>
                        </li>

                    </ul>

                </div>
            </nav>
        </div>
    )
}

export default Navbar;
