import React from 'react';
import Joi from "joi-browser"
import firebase from './firebase'
import Form from './reuseableComps/form';
import { getMainCategories } from '../services/mainCategoriesService';
import { getSubCategory, saveSubCategory } from '../services/subCategoryService';
import { toast } from 'react-toastify';


class SubCategoryForm extends Form {

    state = {
        files: null,
        data: {
            subcategoryname:"",
            image:"",
            maincategoryname: ""
        },
         mainCategory:[],
        errors: {}
    }

    schema = {
        _id: Joi.string(),
        subcategoryname: Joi.string().required().label("Sub Category"),
        image: Joi.string(),
        maincategoryname: Joi.string().required().label("Main Category"),
        
    }

    async populateCategories() {
        const {data: mainCategory} = await getMainCategories();
       
        mainCategory.slice(0, 0, { _id: "", name: "Select a main Category" });
       
        this.setState({ mainCategory })
 
     }

   async componentDidMount() {

    await this.populateCategories();
       
       const subId = this.props.match.params.id;
       if (subId === "new") return;

       try{
           
        const {data: sub} = await getSubCategory(subId);
        this.setState({ data: this.mapToViewModel(sub) });
        console.log(this.state.data);
 
       }
       catch(ex) {

        if (ex.response && ex.response.status === 404) 
        return this.props.history.replace("/notfound")


       }  
    }
   
    mapToViewModel(sub) {

            return {

                _id: sub._id,
                subcategoryname: sub.subcategoryname,
                image: sub.image,
                maincategoryname: sub.mainCategory._id,
    }

    }


    doSubmit = () => {


        
        try{

            
        saveSubCategory(this.state.data)
        this.props.history.push("/subcategories")
    
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
     
        return ( 
            <div style={{margin: "50px"}}>
                <h1>Add / Update a product</h1>

                <img id="imgg" style={{margin: "50px"}}  width="200" height="200" src={this.state.data.image} alt="Please add an Image" className="img-thumbnail sm"></img>
                   <input onChange={(e) =>this.handleChangee(e.target.files)} style={{padding: "10px", paddingRight: "10px"}}  type="file" className="btn btn-primary" ></input>
                   <button onClick={this.handleSave}  style={{marginLeft:"20px"}} className="btn btn-success sm">Upload</button>
                   
                <form onSubmit={this.handleSubmit}>
                        {this.renderInput("subcategoryname","Sub-Category")}
                        {this.renderSelect("maincategoryname","Main-Category", main )}
                        {this.renderButton("Save")}
                </form>
            </div>
            
         );
    }
}
 
export default SubCategoryForm ;