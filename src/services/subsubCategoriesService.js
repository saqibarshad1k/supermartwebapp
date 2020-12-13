import http from "./httpService"

export function getSubSubCategories() {
    return http.get("https://evening-beach-81187.herokuapp.com/apis/product/getsubsubcategory");
}

export function getSubSubCategory(id) {
    return http.get(`https://evening-beach-81187.herokuapp.com/apis/product/getasubsubcategory/${id}`);
}


export function saveSubSubCategory(subsubcategory) {
    if(subsubcategory._id)
    {
        const body = {...subsubcategory};
        delete body._id;
       return http.put(`https://evening-beach-81187.herokuapp.com/apis/product/updatesubsubcategory/${subsubcategory._id}`, body);
            
    }
     return http.post("https://evening-beach-81187.herokuapp.com/apis/product/addsubsubcategory", subsubcategory)
    
}


export function deleteSubSubCategory(id) {
    return http.delete(`https://evening-beach-81187.herokuapp.com/apis/product/deletesubsubcategory/${id}`);
}
