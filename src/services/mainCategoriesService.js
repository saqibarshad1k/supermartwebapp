import http from "./httpService"

export function getMainCategories() {
    return http.get("https://evening-beach-81187.herokuapp.com/apis/product/getmaincategory");
}


export function getMainCategory(id) {
    return http.get(`https://evening-beach-81187.herokuapp.com/apis/product/getamaincategory/${id}`);
}


export function saveMainCategory(maincategory) {
    if(maincategory._id)
    {
        const body = {...maincategory};
        delete body._id;
       return http.put(`https://evening-beach-81187.herokuapp.com/apis/product/updatemaincategory/${maincategory._id}`, body);
            
    }
     return http.post("https://evening-beach-81187.herokuapp.com/apis/product/addmaincategory", maincategory)
    
}


export function deleteMainCategory(id) {
    return http.delete(`https://evening-beach-81187.herokuapp.com/apis/product/deletemaincategory/${id}`);
}