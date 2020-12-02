import React, { Component } from 'react';
import _ from "lodash"
import PropTypes from "prop-types";



const Pagination = (props) => {

   const {itemsCount, pageSize, currentPage} = props;

    const pageCount = Math.ceil(itemsCount / pageSize);

    const pages = _.range(1, pageCount + 1);

    if (pageCount === 1) return null


    return ( 

        <nav>
            <ul className="pagination">
                {
                    pages.map(page => (
                        <li key={page} className={page === currentPage ? "page-item active" : "page-item"}>
                        <a onClick={() => props.onPageChange(page)} className="page-link">{page}</a>
                        </li>
                    ))
                }
                
            </ul>
        </nav>

     );
}

Pagination.propTypes = {
    itemsCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired, 
    currentPage: PropTypes.number.isRequired,

}
 
export default Pagination;