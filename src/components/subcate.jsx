import React, { Component } from 'react';
import { getSubCategories, deleteSubCategory } from './../services/subCategoryService';
import { Link } from 'react-router-dom';
import ProductImage from './reuseableComps/productimage';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from './reuseableComps/pagination';
import { paginate } from './../utils/paginate';
import _ from "lodash"
import DropDowns from './reuseableComps/dropdowns';
import { getMainCategories } from './../services/mainCategoriesService';

class SubCate extends Component {
    state = { 
        subCategories: [],
        mainCategories:[],
        pageSize: 5,
        dropselected: "",
        currentPage: 1,
        sortColumn:
        {
            path:"subcategoryname",
            order:"asc"
        }
     }

     doSort = path => {

        const sortColumn = {...this.state.sortColumn}
        if (sortColumn.path === path)
        {   sortColumn.order =  (sortColumn.order === "asc") ? "desc" : "asc";
         }
        else {
            sortColumn.path = path;
            sortColumn.order = "asc";
        }

        console.log(sortColumn.path)
        console.log(sortColumn.order)
         
        this.setState({ sortColumn})

        console.log(this.state.sortColumn.path)
        console.log(this.state.sortColumn.order)
         
    }

    renderSortIcon = column => {
       
        
        if (column !== this.state.sortColumn.path) return null;
        if (this.state.sortColumn.order === "asc") return <i className="fa fa-sort-asc"></i>
         return <i className="fa fa-sort-desc"></i>
    }

     async componentDidMount() {
         const {data: sub} = await getSubCategories();
         const {data: main} = await getMainCategories();
         this.setState({subCategories: sub, mainCategories: main});
     }

     handlePageChange = (page) => {
        this.setState({currentPage: page});

     }

     handleDelete = async (subcate) => {

            confirmAlert({
              title: 'Please read carefully before deleting',
              message: 'To avoid inconsistancy, deleteing a main category will delete all sub categories, sub-sub categories and products under it.',
              buttons: [
                {
                  label: 'Yes',
                  onClick: async () => {
                    const originalCategories = this.state.subCategories;

                    const subcategories = originalCategories.filter(m => m._id !== subcate)
                    this.setState({subCategories: subcategories}) 
             
                    try{
                     await deleteSubCategory(subcate)
                    }
                    catch(ex){
             
                     if (ex.response && ex.response.status === 404)
                         toast.error("This category has already been deleted.")
             
                         this.setState({subCategories: originalCategories})
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

     handleMainSelect = (selected) => {

      
      
        const sel = (selected.maincategoryname !== "Unselect" ? selected : "") ;
        
        this.setState({dropselected: sel, currentPage: 1}) 
        
 
     }




    render() {
        
   
        const filtered = (this.state.dropselected && this.state.dropselected.maincategoryname !== "Unselect") ? this.state.subCategories.filter(m => m.mainCategory._id === this.state.dropselected._id) : this.state.subCategories; 

        const subcates = filtered.filter(m => m.subcategoryname !== "Unselect")


        const sorted = _.orderBy(subcates, [this.state.sortColumn.path], [this.state.sortColumn.order]);
 
        const sub = paginate(sorted, this.state.currentPage, this.state.pageSize);
        
       
        return (
            <div className="row">
                <div className="col-3">

                <h5>--------Filter--------</h5>
                    <DropDowns

                    onItemSelect={this.handleMainSelect}
                        items={this.state.mainCategories}
                        dropname= "Select Main Category"
                        textProperty="maincategoryname"
                        valueProperty="_id"
                        selected={(!(this.state.dropselected) ? "" : this.state.dropselected)}
                    ></DropDowns>

                </div>
                <div className="col-9">
                <div style={{width: "700px", height:"10px"}}>
                 <Link to="/subcategories/new"
                      className="btn btn-primary"
                      style={{marginBottom: 20}}>  
                    New Sub-Category
                </Link>

                <p>Showing {subcates.length} Categories from the database.</p> 
                
                 <table  className="table table-striped table-sm">
                <thead className="thead-dark">
                    <tr>
                        <th className="clickable" onClick={() => this.doSort("subcategoryname")} >Sub-Category  {this.renderSortIcon("subcategoryname")}</th>
                        <th className="clickable" onClick={() => this.doSort("mainCategory.maincategoryname")} >Main-Category {this.renderSortIcon("mainCategory.maincategoryname")} </th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody  >
                    {sub.map(subcate =>
                        <tr key= {subcate._id}>
                        <td><Link  to={`/subcategories/${subcate._id}`} >{subcate.subcategoryname}</Link></td>
                        <td>{subcate.mainCategory.maincategoryname}</td>
                        <td><ProductImage image={subcate.image} ></ProductImage></td>
                        <td><button style={{verticalAlign : "center"}} onClick={() => this.handleDelete(subcate._id)} className="btn btn-danger btn-sm">Delete</button></td>
                     
                    </tr>
                        )}
                    
                </tbody>
            </table>

            <Pagination 
            onPageChange={this.handlePageChange} 
            currentPage={this.state.currentPage} 
            itemsCount={subcates.length} 
            pageSize= {this.state.pageSize}>
            </Pagination>
            </div>
                </div>
            </div>
           
            
       
         );
    }
}
 
export default SubCate;