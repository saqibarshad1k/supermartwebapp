import React, { Component } from 'react';
import  {getProducts, deleteProduct} from './../services/productService';
import Pagination from './reuseableComps/pagination';
import {paginate} from "../utils/paginate"
import DropDowns from "./reuseableComps/dropdowns"
import { getMainCategories } from '../services/mainCategoriesService';
import { getSubCategories } from '../services/subCategoryService';
import { getSubSubCategories } from '../services/subsubCategoriesService';
import ProductsTable from './productsTable';
import {Link} from "react-router-dom";
import _ from "lodash"
import {toast} from "react-toastify"


class Products extends Component {
    state = { 
        products: [],
        pageSize: 5,
        currentPage: 1,
        mainCategories: [],
        subCategories: [],
        subsubCategories: [],
        orisub:[],
        orisubsub:[],
        dropselected: "",
        dropselecteds: "",
        dropselectedss: "",
        subs: "",
        sortColumn:
        {
            path:"productName",
            order:"asc"
        }
     }

     async componentDidMount() {
       
         const {data: main} = await getMainCategories();
         const {data: sub} = await getSubCategories();
         const {data: subsub} = await getSubSubCategories();
         const {data} =  await getProducts();

         
        this.setState({orisub: sub, orisubsub: subsub, products: data, mainCategories: main, subCategories: sub, subsubCategories: subsub})
        
     }

     handleDelete = async (product) => {

        const originalProducts = this.state.products;

       const products = originalProducts.filter(m => m._id !== product)
       this.setState({products}) 

       try{
        await deleteProduct(product)
       }
       catch(ex){

        if (ex.response && ex.response.status === 404)
            toast.error("This movie has already been deleted.")

            this.setState({products: originalProducts})
       }
        
     }

     showImage = () => {
        
        

     }

     handlePageChange = (page) => {
        this.setState({currentPage: page});

     }
     handleMainSelect = (selected) => {

      
        if(selected.maincategoryname !== "Unselect")
        {
            const s = this.state.orisub.filter(m => selected._id === m.mainCategory._id )
             
            this.setState({subCategories: s});
        }
        else {

            this.setState({subCategories: this.state.orisub, subsubCategories: this.state.orisubsub});
        }
        
        const sel = (selected.maincategoryname !== "Unselect" ? selected : "") ;
        
        this.setState({dropselected: sel, currentPage: 1}) 
        
 
     }

     handleSubSelect = (selected) => {

        if(selected.subcategoryname !== "Unselect")
        {
            const s = this.state.orisubsub.filter(m => selected._id === m.subCategory._id )
        this.setState({subsubCategories: s});
        }
        else {

            this.setState({subsubCategories: this.state.orisubsub});
        }
        
        const selsub = (selected.subcategoryname !== "Unselect" ? selected : "") ;
        this.setState({dropselecteds: selsub, currentPage: 1}) 
         
     }

     handleSubSubSelect = (selected) => {

        const selsub = (selected.subsubcategoryname !== "Unselect" ? selected : "") ;
        this.setState({dropselectedss: selsub, currentPage: 1}) 
         
     }

     handleSort = (sortColumn) => {
         
        this.setState({ sortColumn})


     }

    render() { 

       const {products : Allproducts,sortColumn, dropselectedss, dropselecteds, dropselected, currentPage, pageSize, subsubCategories, subCategories, mainCategories} = this.state;

        // if (Allproducts.length === 0) return <h3>Loading Data from the Database.</h3>
        
        const filtered = (dropselected && dropselected.maincategoryname !== "Unselect") ? Allproducts.filter(m => m.mainCategory._id === dropselected._id) : Allproducts; 

        const filteredsub = (dropselecteds && dropselecteds.subcategoryname !== "Unselect") ? filtered.filter(m => m.subCategory._id === dropselecteds._id) : filtered; 

        const filteredsubsub = (dropselectedss && dropselectedss.subsubcategoryname !== "Unselect") ? filteredsub.filter(m => m.subsubCategory._id === dropselectedss._id) : filteredsub; 

        const sorted = _.orderBy(filteredsubsub, [sortColumn.path], [sortColumn.order]);

        const products = paginate(sorted, currentPage, pageSize);
        
     

        return (
            <div className="row">
                <div className="col-3">

                    <h5>-------Filters-------</h5>
                    <DropDowns

                    onItemSelect={this.handleMainSelect}
                        items={mainCategories}
                        dropname= "Select Main Category"
                        textProperty="maincategoryname"
                        valueProperty="_id"
                        selected={(!(dropselected) ? "" : dropselected)}
                    ></DropDowns>

                     <DropDowns
                    onItemSelect={this.handleSubSelect}
                        items={subCategories}
                        dropname= "Select Sub Category"
                        textProperty="subcategoryname"
                        valueProperty="_id"
                        selected={(!(dropselecteds) ? "" : dropselecteds)}
                    ></DropDowns>

                 <DropDowns
                    onItemSelect={this.handleSubSubSelect}
                        items={subsubCategories}
                        dropname= "Select Sub Sub Category"
                        textProperty="subsubcategoryname"
                        valueProperty="_id"
                        selected={(!(dropselectedss) ? "" : dropselectedss)}
                    ></DropDowns>

                    
                    
                </div>
                <div className="col">

                    <div>
                    <Link to="/products/new"
                      className="btn btn-primary"
                      style={{marginBottom: 20}}>

                    New Product
                </Link>

                    </div>

               

                <p>Showing {filteredsubsub.length} products from the database.</p> 
            
                <ProductsTable sortColumn={sortColumn} products={products} onSort={this.handleSort} onDelete={this.handleDelete} onImage={this.showImage}></ProductsTable>
            <Pagination 
            onPageChange={this.handlePageChange} 
            currentPage={currentPage} 
            itemsCount={filteredsubsub.length} 
            pageSize= {pageSize}>
            </Pagination>
                </div>
            </div>
            
            
         );
    }
}
 
export default Products;