import React from 'react';
import Joi from "joi-browser"
import firebase from './firebase'
import Form from './reuseableComps/form';
import { getMainCategories } from '../services/mainCategoriesService';
import { getSubCategories } from '../services/subCategoryService';
import { toast } from 'react-toastify';
import { getSubSubCategory, saveSubSubCategory } from './../services/subsubCategoriesService';


class SubSubCategoryForm extends Form {

    state = {
        files: null,
        data: {
            subsubcategoryname: "",
            image:"",
            subcategoryname:"",
            maincategoryname:""
        },
         mainCategory:[],
         subCategory:[],
        errors: {}
    }

    schema = {
        _id: Joi.string(),
        subsubcategoryname: Joi.string().required().label("Sub Category"),
        image: Joi.string(),
        subcategoryname: Joi.string().required().label("Sub Category"),
        maincategoryname: Joi.string().required().label("Main Category"),
        
    }

    async populateCategories() {
        const {data: mainCategory} = await getMainCategories();
        const {data: subCategory} = await getSubCategories();
       
        mainCategory.slice(0, 0, { _id: "", name: "Select a Main-Category" });
        subCategory.slice(0, 0, { _id: "", name: "Select a Sub-Category" });
       
        this.setState({ mainCategory, subCategory })
 
     }

   async componentDidMount() {

    await this.populateCategories();
       
       const subsubId = this.props.match.params.id;
       if (subsubId === "new") return;

       try{
           
        const {data: subsub} = await getSubSubCategory(subsubId);
        this.setState({ data: this.mapToViewModel(subsub) });
        console.log(this.state.data);
 
       }
       catch(ex) {

        if (ex.response && ex.response.status === 404) 
        return this.props.history.replace("/notfound")


       }  
    }
   
    mapToViewModel(subsub) {

            return {

                _id: subsub._id,
                subsubcategoryname: subsub.subsubcategoryname,
                image: subsub.image,
                subcategoryname: subsub.subCategory._id,
                maincategoryname: subsub.mainCategory._id,
    }

    }


    doSubmit = () => {


        
        try{

            
        saveSubSubCategory(this.state.data)
        this.props.history.push("/subsubcategories")
    
        }
        catch(ex) {

            if (ex.response && ex.response.status === 400)
            toast.error("Could complete task.")

        }

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
     
        return ( 
            <div style={{margin: "50px"}}>
                <h1>Add / Update a SubSub-Category</h1>

                <img id="imgg" style={{margin: "50px"}}  width="200" height="200" src={this.state.data.image} alt="Please add an Image" className="img-thumbnail sm"></img>
                   <input onChange={(e) =>this.handleChangee(e.target.files)} style={{padding: "10px", paddingRight: "10px"}}  type="file" className="btn btn-primary" ></input>
                   <button onClick={this.handleSave}  style={{marginLeft:"20px"}} className="btn btn-success sm">Upload</button>
                   
                <form onSubmit={this.handleSubmit}>
                        {this.renderInput("subsubcategoryname","SubSub-Category")}
                        {this.renderSelect("maincategoryname","Main-Category", main )}
                        {this.renderSelect("subcategoryname","Sub-Category", sub )}
                        {this.renderButton("Save")}
                </form>
            </div>
            
         );
    }
}
 
export default SubSubCategoryForm ;