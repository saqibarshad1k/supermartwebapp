import React, { Component } from 'react';
import { getMainCategories, deleteMainCategory } from './../services/mainCategoriesService';
import { Link } from 'react-router-dom';
import ProductImage from './reuseableComps/productimage';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';

class MainCate extends Component {
    state = { 
        mainCategories: []
     }

     async componentDidMount() {
         const {data} = await getMainCategories();
         this.setState({mainCategories: data});
     }

     handleDelete = async (maincate) => {

            confirmAlert({
              title: 'Please read carefully before deleting',
              message: 'To avoid inconsistancy, deleteing a main category will delete all sub categories, sub-sub categories and products under it.',
              buttons: [
                {
                  label: 'Yes',
                  onClick: async () => {
                    const originalCategories = this.state.mainCategories;

                    const maincategories = originalCategories.filter(m => m._id !== maincate)
                    this.setState({mainCategories: maincategories}) 
             
                    try{
                     await deleteMainCategory(maincate)
                    }
                    catch(ex){
             
                     if (ex.response && ex.response.status === 404)
                         toast.error("This category has already been deleted.")
             
                         this.setState({mainCategories: originalCategories})
                    }
                  }
                },
                {
                  label: 'No',
                  onClick: () => {return}
                }
              ]
            });
    

        
        
     }



    render() { 

        const data = this.state.mainCategories;
       
        return (
            <div style={{width: "800px"}}>
                 <Link to="/maincategories/new"
                      className="btn btn-primary"
                      style={{marginBottom: 20}}>  
                    New Main-Category
                </Link>
                
                 <table  className="table table-striped table-sm">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody  >
                    {this.state.mainCategories.map(maincate =>
                        <tr key= {maincate._id}>
                        <td><Link  to={`/maincategories/${maincate._id}`} >{maincate.maincategoryname}</Link></td>
                        <td><ProductImage image={maincate.image} ></ProductImage></td>
                        <td><button style={{verticalAlign : "center"}} onClick={() => this.handleDelete(maincate._id)} className="btn btn-danger btn-sm">Delete</button></td>
                     
                    </tr>
                        )}
                    
                </tbody>
            </table>
            </div>
            
       
         );
    }
}
 
export default MainCate;