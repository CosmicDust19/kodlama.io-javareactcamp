import axios from "axios"

export default class SystemEmployeeService {
    existsByEmailAndPassword(email, password){
        return axios.get("http://localhost:8080/api/systemEmployees/existsByEmailAndPassword?email=" + email + "&password=" + password)
    }

    getSystemEmployees(){
        return axios.get("http://localhost:8080/api/systemEmployees/getAll");
    }

    getById(id){
        return axios.get("http://localhost:8080/api/systemEmployees/getById?id=" + id);
    }

    getByEmailAndPassword(email, password){
        return axios.get("http://localhost:8080/api/systemEmployees/getByEmailAndPassword?email=" + email +  "&password=" + password)
    }

    add(values){
        return axios.post("http://localhost:8080/api/systemEmployees/add",values)
    }
}