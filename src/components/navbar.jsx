import React, { Component } from 'react';
import {Link, NavLink} from "react-router-dom";
import Logout from './logout';

const NavBar = ({user}) => {
    return ( 
       
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="#"><h4>SuperMart Admin Panel</h4></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">Manage Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/customers">Customers</NavLink>
            </li>
           
            <li className="nav-item">
              <NavLink className="nav-link" to="/logout">Logout</NavLink>
            </li>
            {user && 
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">Register</NavLink>
            </li>}

          </ul>
        </div>
      </nav>
      



     );
}
 
export default NavBar;