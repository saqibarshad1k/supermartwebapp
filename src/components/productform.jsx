import React from 'react';
import Joi from "joi-browser"
import firebase from './firebase'
import Form from './reuseableComps/form';
import { getMainCategories } from '../services/mainCategoriesService';
import { getSubCategories } from '../services/subCategoryService';
import { getSubSubCategories } from '../services/subsubCategoriesService';
import { getProduct, saveProduct } from './../services/productService';
import _ from "lodash"

class ProductForm extends Form {

    state = {
        files: null,
        productId: "",
        data: {
            productName: "",
            companyName: "",
            price:"",
            maincategoryname:"",
            subcategoryname:"",
            subsubcategoryname:"",
            image:""
        },
         mainCategory:[],
         subCategory:[],
         subsubCategory:[],
        errors: {}
    }

    schema = {
        _id: Joi.string(),
        productName: Joi.string().required().label("Product Name"),
        companyName: Joi.string().required().label("Company Name"),
        price: Joi.number().required().label("Price"),
        maincategoryname: Joi.string().required().label("Main Category"),
        subcategoryname: Joi.string().required().label("Sub Category"),
        subsubcategoryname: Joi.string().required().label("Sub Sub Category"),
        image: Joi.string()
    }

    async populateCategories() {
        const {data: mainCategory} = await getMainCategories();
       const {data: subCategory} = await getSubCategories();
       const {data: subsubCategory} = await getSubSubCategories();

        mainCategory.slice(0, 0, { _id: "", name: "Select a main Category" });
        subCategory.slice(0, 0, { _id: "", name: "Select a sub Category" });
        subsubCategory.slice(0, 0, { _id: "", name: "Select a sub Category" });
        
        this.setState({ mainCategory, subCategory, subsubCategory })
 
     }

   async componentDidMount() {

    await this.populateCategories();
       
       const productId = this.props.match.params.id;
       if (productId === "new") return;

       try{
        const {data: product} = await getProduct(productId);
        this.setState({ data: this.mapToViewModel(product) });
 
       }
       catch(ex) {

        if (ex.response && ex.response.status === 404) 
        return this.props.history.replace("/notfound")


       }  
    }
   
    mapToViewModel(product) {

            return {

                _id: product._id,
                productName: product.productName,
                companyName: product.companyName,
                price: product.price,
                maincategoryname: product.mainCategory._id,
                subcategoryname: product.subCategory._id,
                subsubcategoryname: product.subsubCategory._id,
                image: product.image

    }

    }


    doSubmit = () => {

        saveProduct(this.state.data)
        this.props.history.push("/products")

    }

    handleChangee = (files) => {

        this.setState({
            files
        })

    }

    handleSave = () => {

        let bucketname = "images"
        let file = this.state.files[0]
        let storageRef = firebase.storage().ref(`${bucketname}/${file.name}`) 
        let uploadtask = storageRef.put(file)
        uploadtask.on(firebase.storage.TaskEvent.STATE_CHANGE, () => {
             uploadtask.snapshot.ref.getDownloadURL().then((url) =>{
                let da = {...this.state.data}
                da.image = url
                this.setState({data: da})
             })
                
            })

    }

    


    render() { 

     let main = (this.state.mainCategory).filter(m => m.maincategoryname !== "Unselect")
     let sub = (this.state.subCategory).filter(m => m.subcategoryname !== "Unselect")
     sub = sub.filter(m => m.mainCategory._id === this.state.data.maincategoryname);
     let subsub = (this.state.subsubCategory).filter(m => m.subsubcategoryname !== "Unselect")
     subsub = subsub.filter(m => m.subCategory._id === this.state.data.subcategoryname);  

        return ( 
            <div style={{margin: "50px"}}>
                <h1>Add / Update a product</h1>

                <img id="imgg" style={{margin: "50px"}}  width="200" height="200" src={this.state.data.image} alt="Please add an Image" className="img-thumbnail sm"></img>
                   <input onChange={(e) =>this.handleChangee(e.target.files)} style={{padding: "10px", paddingRight: "10px"}}  type="file" className="btn btn-primary" ></input>
                   <button onClick={this.handleSave}  style={{marginLeft:"20px"}} className="btn btn-success sm">Upload</button>
                   
                <form onSubmit={this.handleSubmit}>
                        {this.renderInput("productName","Product Name")}
                        {this.renderInput("companyName","Comapany Name")}
                        {this.renderInput("price","Price")}
                        {this.renderSelect("maincategoryname","Main Category", main )}
                        {this.renderSelect("subcategoryname","Sub Category", sub)}
                        {this.renderSelect("subsubcategoryname","Sub Sub Category",subsub)}
                        
                        {this.renderButton("Save")}
                </form>
            </div>
            
         );
    }
}
 
export default ProductForm ;