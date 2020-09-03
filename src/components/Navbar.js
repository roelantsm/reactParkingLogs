import React from 'react'
import '../App.css';

import { NavLink } from 'react-router-dom'; 

import { Navbar } from 'react-bootstrap';
//import { NavDropdown } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';



// import Home from './Pages/Home';
// import Billing from './Pages/Billing';
// import Post from './Pages/Post';

const  Navbar2 = () => {
    
    return (
        <div>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Monitoring Parkings Cronos</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
    
            <Nav.Link> 
                <NavLink  class="navBarLink" to="/">Home
                    </NavLink>
            </Nav.Link>

    
            <Nav.Link> 
                <NavLink  class="navBarLink" to="/overzicht">overzicht
                    </NavLink>
            </Nav.Link>
            <Nav.Link> 
                <NavLink  class="navBarLink" to="/billing">billing
                    </NavLink>
            </Nav.Link>
            <Nav.Link> 
                <NavLink  class="navBarLink" to="/events">Event
                    </NavLink>
            </Nav.Link>

                </Nav>
            </Navbar.Collapse>
            </Navbar>
        </div>


    )
}

export default Navbar2;
