import React, { Component } from 'react';
import Joi from "joi-browser"
import Form from './reuseableComps/form';
import {login} from "../services/authService"

class LoginForm extends Form {

    state = {
        data: {
            phone: "",
            password: ""
        },
        errors: {}
    }

    schema = {
        phone: Joi.string().required().label("phone"),
        password: Joi.string().required().label("Password")
    }

   
   


    doSubmit = async () => {

        try{
         const res =   await login(this.state.data)
       
            localStorage.setItem("token", res.headers["x-auth-token"])
           window.location = "/"
        }
        catch(ex){
            if(ex.response && ex.response.status === 400){
                const errors = {...this.state.errors}
                errors.username = ex.response.data
                this.setState({ errors })
            }
        }

    }

    


    render() { 

       

        return ( 
            <div>
                <h1 style={{ margin: "30px", textAlign:"center", padding:"20px"}}><b>SuperMart</b></h1>
            <div className="log primary">
                
                <h1 style={{ color: "white", textAlign:"center", paddingBottom:"20px"}}>Login</h1>
                <form style={{alignSelf :"center"}} onSubmit={this.handleSubmit}>
                        {this.renderInput("phone","Phone")}
                        {this.renderInput("password","Password", "password")}
                        {this.renderButton("Login")}
                </form>
            </div>
            </div>
            
         );
    }
}
 
export default LoginForm ;