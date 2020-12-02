import React, { Component } from 'react';
import {Dropdown} from 'react-bootstrap'

const DropDowns = ({dropname, items, textProperty, valueProperty, onItemSelect, selected}) => {

    return (

        <Dropdown style={{width: "100px",marginRight: "30px", marginTop: "30px"}}>
  <Dropdown.Toggle variant="primary" id="dropdown-basic">
    {(!(selected[textProperty])) ? dropname : selected[textProperty] }
  </Dropdown.Toggle>

  <Dropdown.Menu>
      {
         items.map(itms => <Dropdown.Item onClick={() =>onItemSelect(itms)} key={itms[valueProperty]} 
         
        
         >{itms[textProperty]}</Dropdown.Item>) 
      }
    
  </Dropdown.Menu>
</Dropdown>

     );
}
 
export default DropDowns;