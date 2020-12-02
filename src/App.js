import React, { Component } from 'react';
import './App.css';
import Products from "./components/products"
import {Route, Redirect, Switch} from "react-router-dom"
import Customers from './components/customers';
import NotFound from './components/notfound';
import NavBar from './components/navbar';
import ProductForm from "./components/productform"
import LoginForm from './components/loginform';
import RegisterForm from './components/registerform';
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode"
import Logout from './components/logout';

class App extends Component {

  state = {}

  componentDidMount() {
   
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);

    this.setState({user})

    }
    catch(ex){
      
    }
    
  }

 
  render() { 

    return ( 

      <React.Fragment>
        <ToastContainer></ToastContainer>
        {this.state.user && <NavBar user={this.state.user}></NavBar>}
      
      <main className="container">
        <Switch>
        <Route 
        path="/register" component={RegisterForm}></Route>
        <Route 
        path="/login" 
        render={props => {
          if(this.state.user) return<Redirect to="/products"></Redirect>
          return <LoginForm {...props}></LoginForm>
        }}></Route>
        <Route path="/logout" component={Logout}></Route>
        <Route path="/products/:id" component={ProductForm}></Route>
        <Route 
        path="/products" 
        render={props => {
          if(!this.state.user) return<Redirect to="/login"></Redirect>
          return <Products {...props}></Products>
        }}></Route>
        <Route 
        path="/customers" 
        render={props => {
          if(!this.state.user) return<Redirect to="/login"></Redirect>
          return <Customers {...props}></Customers>
        }}></Route>
        <Route path="/notfound" component={NotFound}></Route>
        <Redirect from="/" exact to="/products"></Redirect>
        <Redirect to="/notfound" ></Redirect>
        </Switch>
       
      </main>
      </React.Fragment>
      
     );
  }
}
 
export default App;
