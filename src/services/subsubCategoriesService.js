import http from "./httpService"

export function getSubSubCategories() {
    return http.get("https://evening-beach-81187.herokuapp.com/apis/product/getsubsubcategory");
}