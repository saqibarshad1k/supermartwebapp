import React, { Component } from 'react';
import Joi from "joi-browser"
import Input from "./input"
import Select from "./select"
import Checkbox from "./checkbox"

class Form extends Component {
    state = { 
        data: {},
        errors: {}
     }

     validate = () => {

        const result = Joi.validate(this.state.data, this.schema,
               {abortEarly: false});

               console.log(result.error)
               console.log(this.state.data)
   
               if (!result.error) return null;
   
               const errors = {};
               for (let item of result.error.details)
                   errors[item.path[0]] = item.message; 
               return errors;
       }

       
       validateProperty = ({name, value}) => 
    {
       
        const obj = { [name]: value};
        const schema = {[name]: this.schema[name]};
        const {error} = Joi.validate(obj, schema);
        return error ? error.details[0].message :  null

    }

    handleSubmit = e => {
        e.preventDefault();

        const error = this.validate();
        this.setState({ errors: error || {} });
        if (error) return;

       this.doSubmit();

    };

    
    handleChange = ({currentTarget: input}) => {

     
        const errors = {...this.state.errors};
       const errorMessage = this.validateProperty(input);

       console.log(input)
  
          if(errorMessage) errors[input.name] = errorMessage;
         else delete errors[input.name]
  
        //   const data = {...this.state.data};
        //   data[input.name] = input.value;
        //   this.setState({data, errors});

      const data = { ...this.state.data };
      if (input) {
         data[input.name] = input.type === 'checkbox' ? input.checked : input.value;
      }
      this.setState({ errors, data });
    }

    renderInput(name, label, type = "text"){
        const { data } = this.state;

        return(
            <Input 
            type={type}
            error={this.state.errors[name]} 
            name={name} 
            value={data[name]} 
            label={label} 
            onChange={this.handleChange}>
            </Input>
                   
        );
    }

    renderCheckBox(name, label) {
        return (
           <Checkbox 
           name={name} 
           value={this.state.data[name]} 
           onChange={this.handleChange} 
           error={this.state.errors[name]}>
              {label}
              
           </Checkbox>
        );
     }

    

    renderButton(label) {
        return(
            <button 
            
            disabled={this.validate()} 
            type="submit" 
            className="btn btn-primary">{label}
            </button>
        );
    }

    renderSelect(name, label, options) {
        return(
            <Select
            error={this.state.errors[name]} 
            name={name} 
            value={this.state.data[name]} 
            label={label} 
            onChange={this.handleChange}
            options={options}
            />   
        );
    }
   
}
 
export default Form;