import React, { Component } from 'react';
import { getMainCategories, deleteMainCategory } from './../services/mainCategoriesService';
import { Link } from 'react-router-dom';
import ProductImage from './reuseableComps/productimage';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from './reuseableComps/pagination';
import { paginate } from './../utils/paginate';
import _ from "lodash"

class MainCate extends Component {
    state = { 
        mainCategories: [],
        pageSize: 5,
        currentPage: 1,
        sortColumn:
        {
            path:"maincategoryname",
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

        this.setState({ sortColumn})
         
    }

    renderSortIcon = column => {
       
        
        if (column !== this.state.sortColumn.path) return null;
        if (this.state.sortColumn.order === "asc") return <i className="fa fa-sort-asc"></i>
         return <i className="fa fa-sort-desc"></i>
    }

     async componentDidMount() {
         
         const {data} = await getMainCategories();
         this.setState({mainCategories: data});
     }

     handlePageChange = (page) => {
        this.setState({currentPage: page});

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

        const maincates = this.state.mainCategories.filter(m => m.maincategoryname !== "Unselect")


        const sorted = _.orderBy(maincates, [this.state.sortColumn.path], [this.state.sortColumn.order]);
 
        const main = paginate(sorted, this.state.currentPage, this.state.pageSize);
        
       
        return (
            <div style={{width: "800px", height:"10px"}}>
                 <Link to="/maincategories/new"
                      className="btn btn-primary"
                      style={{marginBottom: 20}}>  
                    New Main-Category
                </Link>

                <p>Showing {maincates.length} Categories from the database.</p> 
            
                
                 <table  className="table table-striped table-sm">
                <thead className="thead-dark">
                    <tr>
                        <th className="clickable" onClick={() => this.doSort("maincategoryname")} >Name  {this.renderSortIcon("maincategoryname")}</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody  >
                    {main.map(maincate =>
                        <tr key= {maincate._id}>
                        <td><Link  to={`/maincategories/${maincate._id}`} >{maincate.maincategoryname}</Link></td>
                        <td><ProductImage image={maincate.image} ></ProductImage></td>
                        <td><button style={{verticalAlign : "center"}} onClick={() => this.handleDelete(maincate._id)} className="btn btn-danger btn-sm">Delete</button></td>
                     
                    </tr>
                        )}
                    
                </tbody>
            </table>

            <Pagination 
            onPageChange={this.handlePageChange} 
            currentPage={this.state.currentPage} 
            itemsCount={maincates.length} 
            pageSize= {this.state.pageSize}>
            </Pagination>
            </div>
            
       
         );
    }
}
 
export default MainCate;