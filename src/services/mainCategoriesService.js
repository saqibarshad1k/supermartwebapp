import http from "./httpService"

export function getMainCategories() {
    return http.get("https://evening-beach-81187.herokuapp.com/apis/product/getmaincategory");
}