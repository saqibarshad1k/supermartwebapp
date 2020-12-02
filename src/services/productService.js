import http from "./httpService"

export function getProducts() {
    return http.get("https://evening-beach-81187.herokuapp.com/apis/product/getallproducts");
}

export function getProduct(id) {
    return http.get(`https://evening-beach-81187.herokuapp.com/apis/product/getproduct/${id}`);
}

export function saveProduct(product) {
    if(product._id)
    {
        const body = {...product};
        delete body._id;
       return http.put(`https://evening-beach-81187.herokuapp.com/apis/product/updateproduct/${product._id}`, body);
            
    }
     return http.post("https://evening-beach-81187.herokuapp.com/apis/product/addnewproduct", product)
    
}


export function deleteProduct(id) {
    return http.delete(`https://evening-beach-81187.herokuapp.com/apis/product/deleteproduct/${id}`);
}