import React, { Component } from 'react';
import { getSubSubCategories, deleteSubSubCategory } from './../services/subsubCategoriesService';
import { getMainCategories } from './../services/mainCategoriesService';
import { Link } from 'react-router-dom';
import ProductImage from './reuseableComps/productimage';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from './reuseableComps/pagination';
import { paginate } from './../utils/paginate';
import _, { filter } from "lodash"
import DropDowns from './reuseableComps/dropdowns';
import { getSubCategories } from './../services/subCategoryService';

class SubSubCate extends Component {
    state = { 
        subCategories: [],
        subsubCategories: [],
        mainCategories:[],
        orisub:[],
        orisubsub:[],
        pageSize: 5,
        dropselected: "",
        dropselecteds: "",
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
         const {data: subsub} = await getSubSubCategories();
         const {data: main} = await getMainCategories();
         const {data: sub} = await getSubCategories();
         this.setState({orisubsub: subsub,orisub: sub, subCategories: sub, subsubCategories: subsub, mainCategories: main});
     }

     handlePageChange = (page) => {
        this.setState({currentPage: page});

     }

     handleDelete = async (subsubcate) => {

            confirmAlert({
              title: 'Please read carefully before deleting',
              message: 'To avoid inconsistancy, deleteing a sub category will delete all products under it.',
              buttons: [
                {
                  label: 'Yes',
                  onClick: async () => {
                    const originalCategories = this.state.subCategories;

                    const subcategories = originalCategories.filter(m => m._id !== subsubcate)
                    this.setState({subCategories: subcategories}) 
             
                    try{
                     await deleteSubSubCategory(subsubcate)
                    }
                    catch(ex){
             
                     if (ex.response && ex.response.status === 404)
                         toast.error("This category has already been deleted.")
             
                         this.setState({subsubCategories: originalCategories})
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
        
        const selsub = (selected.subcategoryname !== "Unselect" ? selected : "") ;
        this.setState({dropselecteds: selsub, currentPage: 1}) 
         
     }




    render() {
        
   
        const filtered = (this.state.dropselected && this.state.dropselected.maincategoryname !== "Unselect") ? this.state.subsubCategories.filter(m => m.mainCategory._id === this.state.dropselected._id) : this.state.subsubCategories; 

        const filteredsub = (this.state.dropselecteds && this.state.dropselecteds.subcategoryname !== "Unselect") ? filtered.filter(m => m.subCategory._id === this.state.dropselecteds._id) : filtered; 


        const subsubcates = filteredsub.filter(m => m.subsubcategoryname !== "Unselect");

        const sorted = _.orderBy(subsubcates, [this.state.sortColumn.path], [this.state.sortColumn.order]);
 
        const subsub = paginate(sorted, this.state.currentPage, this.state.pageSize);
        
       
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

<DropDowns
                    onItemSelect={this.handleSubSelect}
                        items={this.state.subCategories}
                        dropname= "Select Sub Category"
                        textProperty="subcategoryname"
                        valueProperty="_id"
                        selected={(!(this.state.dropselecteds) ? "" : this.state.dropselecteds)}
                    ></DropDowns>

                </div>
                <div className="col-9">
                <div style={{width: "700px", height:"10px"}}>
                 <Link to="/subsubcategories/new"
                      className="btn btn-primary"
                      style={{marginBottom: 20}}>  
                    New Sub-Category
                </Link>

                <p>Showing {subsubcates.length} Categories from the database.</p> 
                
                 <table  className="table table-striped table-sm">
                <thead className="thead-dark">
                    <tr>
                        <th className="clickable" onClick={() => this.doSort("subcategoryname")} >SubSub-Category  {this.renderSortIcon("subcategoryname")}</th>
                        <th className="clickable" onClick={() => this.doSort("subCategory.subcategoryname")} >Sub-Category {this.renderSortIcon("subCategory.subcategoryname")} </th>
                        <th className="clickable" onClick={() => this.doSort("mainCategory.maincategoryname")} >Main-Category {this.renderSortIcon("mainCategory.maincategoryname")} </th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody  >
                    {subsub.map(subsubcate =>
                        <tr key= {subsubcate._id}>
                        <td><Link  to={`/subsubcategories/${subsubcate._id}`} >{subsubcate.subsubcategoryname}</Link></td>
                        <td>{subsubcate.subCategory.subcategoryname}</td>
                        <td>{subsubcate.mainCategory.maincategoryname}</td>
                        <td><ProductImage image={subsubcate.image} ></ProductImage></td>
                        <td><button style={{verticalAlign : "center"}} onClick={() => this.handleDelete(subsubcate._id)} className="btn btn-danger btn-sm">Delete</button></td>
                     
                    </tr>
                        )}
                    
                </tbody>
            </table>

            <Pagination 
            onPageChange={this.handlePageChange} 
            currentPage={this.state.currentPage} 
            itemsCount={subsubcates.length} 
            pageSize= {this.state.pageSize}>
            </Pagination>
            </div>
                </div>
            </div>
           
            
       
         );
    }
}
 
export default SubSubCate;