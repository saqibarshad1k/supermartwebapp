import React, { Component } from 'react';


class ProductImage extends Component {
    
    render() { 

       return (
        <img  width="50" height="50" src={this.props.image} alt="Image" className="img-thumbnail sm"></img>

       );
    }
}
 

export default ProductImage;