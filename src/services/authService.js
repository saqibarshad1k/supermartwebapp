import http from "./httpService"

export function login(user) {
    return http.post("https://evening-beach-81187.herokuapp.com/apis/admin/signin", user);
}



