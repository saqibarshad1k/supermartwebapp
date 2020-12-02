import React, { Component } from 'react';
import ProductImage from "./reuseableComps/productimage"
import { Link } from 'react-router-dom';

class ProductTable extends Component {

    doSort = path => {
        const sortColumn = {...this.props.sortColumn}
        if (sortColumn.path === path)
        {   sortColumn.order =  (sortColumn.order === "asc") ? "desc" : "asc";
    }
        else {
            sortColumn.path = path;
            sortColumn.order = "asc";
        }
           this.props.onSort(sortColumn)
    }

    renderSortIcon = column => {
        console.log(column)
        if (column !== this.props.sortColumn.path) return null;
        if (this.props.sortColumn.order === "asc") return <i className="fa fa-sort-asc"></i>
         return <i className="fa fa-sort-desc"></i>
    }
    
    render() { 
      
            const {products, onDelete, onImage} =  this.props

    return ( 
        <table  className="table table-striped table-sm">
                <thead className="thead-dark">
                    <tr>
                        <th className="clickable" onClick={() => this.doSort("productName")}>Product  {this.renderSortIcon("productName")}</th>
                        <th className="clickable" onClick={() => this.doSort("companyName")}>Company {this.renderSortIcon("companyName")}</th>
                        <th className="clickable" onClick={() => this.doSort("price")}>Price {this.renderSortIcon("price")}</th>
                        <th className="clickable" onClick={() => this.doSort("mainCategory.maincategoryname")}>Main Category {this.renderSortIcon("mainCategory.maincategoryname")}</th>
                        <th className="clickable" onClick={() => this.doSort("subCategory.subcategoryname")}>Sub Category {this.renderSortIcon("subCategory.subcategoryname")}</th>
                        <th className="clickable" onClick={() => this.doSort("subsubCategory.subsubcategoryname")}>Sub Sub Category {this.renderSortIcon("subsubCategory.subsubcategoryname")}</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody  >
                    {products.map(prod =>
                        <tr key= {prod._id}>
                        <td><Link to={`/products/${prod._id}`} >{prod.productName}</Link></td>
                        <td>{prod.companyName}</td>
                        <td>{prod.price}</td>
                        <td>{prod.mainCategory.maincategoryname}</td>
                        <td>{prod.subCategory.subcategoryname}</td>
                        <td>{prod.subsubCategory.subsubcategoryname}</td>
                        <td ><ProductImage image={prod.image} onImageClick={() => onImage(prod.image)}></ProductImage></td>
                        <td><button style={{verticalAlign : "center"}} onClick={() => onDelete(prod._id)} className="btn btn-danger btn-sm">Delete</button></td>
                    
                    </tr>
                        )}
                    
                </tbody>
            </table>

         );
    }
}
 
export default ProductTable;