import React, { Component } from 'react';
import {Link, NavLink} from "react-router-dom";
import Logout from './logout';
import {NavDropdown} from 'react-bootstrap'

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
    
              <NavDropdown title="Manage Products" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1"> <NavLink style={{color: "black"}} className="nav-link" to="/products">Products</NavLink>
              </NavDropdown.Item>
        <NavDropdown.Item eventKey="5"> <NavLink style={{color: "black"}} className="nav-link" to="/maincategories">Main Category</NavLink> </NavDropdown.Item>
        <NavDropdown.Item eventKey="5">Sub Category</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
      </NavDropdown>
            
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