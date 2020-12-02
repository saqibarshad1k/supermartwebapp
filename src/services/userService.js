import http from "./httpService"

export function registerUser(user) {
    return http.post("https://evening-beach-81187.herokuapp.com/apis/admin/signup", user);
}

