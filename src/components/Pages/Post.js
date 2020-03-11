import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'; 

export default class Post extends Component {

    render() {
        return (
            <div>
                 <div>
           
            <NavLink to="/post/1">Post1</NavLink>
            <NavLink to="/post/2">Post2</NavLink>
            <NavLink to="/post/3">Post3</NavLink>
        </div>
            </div>
        )
    }
}
