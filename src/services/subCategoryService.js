import http from "./httpService"

export function getSubCategories() {
    return http.get("https://evening-beach-81187.herokuapp.com/apis/product/getsubcategory");
}