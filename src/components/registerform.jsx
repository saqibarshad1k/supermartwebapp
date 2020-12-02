import React, { Component } from 'react';
import Joi from "joi-browser"
import Form from './reuseableComps/form';
import * as userService from "../services/userService"

class RegisterForm extends Form {

    state = {
        data: {
            phone: "",
            password: "",
            name:"",
            isAdmin: false,
            isProductManager: false,
            isOrderTracker: false
        },
        errors: {}
    }

    schema = {
        phone: Joi.string().required().label("Phone"),
        password: Joi.string().required().min(5).label("Password"),
        name: Joi.string().required().label("Name"),
        isAdmin: Joi.any().label('Admin'),
        isProductManager: Joi.any().label('Product Manager'),
        isOrderTracker: Joi.any().label('Order Manager')
    }

   
   


    doSubmit = async() => {

        try{
           const res =  await userService.registerUser(this.state.data)

            localStorage.setItem("token", res.headers["x-auth-token"])
            this.props.history.push("/")
        
        }
        catch(ex){
            if( ex.reponse && ex.response.status === 400)
            {
                const errors = {...this.state.errors}
                errors.username = ex.response.data;
                this.setState({errors});
            }
        }

        

    }

    


    render() { 

       

        return ( 
            <div>
                <h1>Register a new User</h1>

                <form onSubmit={this.handleSubmit}>
                        {this.renderInput("phone","Phone")}
                        {this.renderInput("password","Password", "password")}
                        {this.renderInput("name","Name")}
                        {this.renderCheckBox('isAdmin', <span>Admin</span>)}
                        {this.renderCheckBox('isProductManager', <span>Product Manager</span>)}
                        {this.renderCheckBox('isOrderTracker', <span>Order Manager</span>)}
                        {this.renderButton("Register")}
                </form>
            </div>
            
         );
    }
}
 
export default RegisterForm ;