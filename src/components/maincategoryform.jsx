import React, { Component } from 'react';
import Form from './reuseableComps/form';
import Joi from "joi-browser"
import firebase from './firebase'
import { getMainCategory, saveMainCategory } from './../services/mainCategoriesService';
import { toast } from 'react-toastify';

class MainCategoryForm extends Form {
    state = { 
        files: null,
        maincateId: "",
        data: {
            maincategoryname: "",
            image:""
        },
        errors: {}
            }

     schema = {
        _id: Joi.string(),
        maincategoryname: Joi.string().required().label("Main-Category Name"),
       image: Joi.string()
    }

    async componentDidMount() {

       const maincateId = this.props.match.params.id;
       if (maincateId === "new") return;

       try{
        const {data: maincate} = await getMainCategory(maincateId);
        this.setState({ data: this.mapToViewModel(maincate) });
 
       } 
       catch(ex) {

        if (ex.response && ex.response.status === 404) 
        return this.props.history.replace("/notfound")


       }  
    }

    mapToViewModel(maincate) {

        return {

            _id: maincate._id,
            maincategoryname: maincate.maincategoryname,
            image: maincate.image

}
    }

    doSubmit = () => {
        try{
            
            saveMainCategory(this.state.data)
            this.props.history.push("/maincategories")

        }
        catch(ex){

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
        return ( 
            <div style={{margin: "50px"}}>
            <h1>Add / Update a Main-Category</h1>

            <img id="imgg" style={{margin: "50px"}}  width="200" height="200" src={this.state.data.image} alt="Please add an Image" className="img-thumbnail sm"></img>
               <input onChange={(e) =>this.handleChangee(e.target.files)} style={{padding: "10px", paddingRight: "10px"}}  type="file" className="btn btn-primary" ></input>
               <button onClick={this.handleSave}  style={{marginLeft:"20px"}} className="btn btn-success sm">Upload</button>
               


            <form onSubmit={this.handleSubmit}>
                    {this.renderInput("maincategoryname","Main-Category Name")}
                    {this.renderButton("Save")}
            </form>
        </div>
         );
    }
}
 
export default MainCategoryForm;