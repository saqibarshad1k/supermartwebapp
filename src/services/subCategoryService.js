import http from "./httpService"

export function getSubCategories() {
    return http.get("https://evening-beach-81187.herokuapp.com/apis/product/getsubcategory");
}

export function getSubCategory(id) {
    return http.get(`https://evening-beach-81187.herokuapp.com/apis/product/getasubcategory/${id}`);
}


export function saveSubCategory(subcategory) {
    if(subcategory._id)
    {
        const body = {...subcategory};
        delete body._id;
       return http.put(`https://evening-beach-81187.herokuapp.com/apis/product/updatesubcategory/${subcategory._id}`, body);
            
    }
     return http.post("https://evening-beach-81187.herokuapp.com/apis/product/addsubcategory", subcategory)
    
}


export function deleteSubCategory(id) {
    return http.delete(`https://evening-beach-81187.herokuapp.com/apis/product/deletesubcategory/${id}`);
}

