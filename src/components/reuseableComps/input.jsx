import React, { Component } from 'react';

const Input = ({type, name, label, error, value, onChange}) => {
    return ( 
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
           <input 
           name={name} 
           onChange={onChange} 
           value={value} 
           autoFocus 
           id={name} 
           type={type} 
           className="form-control"/>
           {error && <div className="alert alert-danger">{error}</div>}
      </div>
     );
}
 
export default Input;