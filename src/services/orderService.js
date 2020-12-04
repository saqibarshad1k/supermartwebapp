import http from "./httpService"

export function getOrders() {
    return http.get("https://evening-beach-81187.herokuapp.com/apis/order/getOrders");
}

