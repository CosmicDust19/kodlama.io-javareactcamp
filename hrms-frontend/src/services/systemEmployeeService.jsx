import axios from "axios"

export default class SystemEmployeeService {
    getSystemEmployees(){
        return axios.get("http://localhost:8080/api/systemEmployees/getAll");
    }

    getById(id){
        return axios.get(`http://localhost:8080/api/systemEmployees/getById?id=${id}`);
    }

    existsByEmailAndPassword(email, password){
        return axios.get(`http://localhost:8080/api/systemEmployees/existsByEmailAndPassword?email=${email}&password=${password}`)
    }

    getByEmailAndPassword(email, password){
        return axios.get(`http://localhost:8080/api/systemEmployees/getByEmailAndPassword?email=${email}&password=${password}`)
    }

    add(values){
        return axios.post("http://localhost:8080/api/systemEmployees/add",values)
    }

    updateFirstName(id, firstName){
        return axios.put(`http://localhost:8080/api/systemEmployees/updateFirstName?firstName=${firstName}&id=${id}`)
    }

    updateLastName(id, lastName){
        return axios.put(`http://localhost:8080/api/systemEmployees/updateLastName?id=${id}&lastName=${lastName}`)
    }

    updateEmail(id, email){
        return axios.put(`http://localhost:8080/api/systemEmployees/updateEmail?email=${email}&id=${id}`)
    }

    updatePassword(id, password, oldPassword){
        return axios.put(`http://localhost:8080/api/systemEmployees/updatePassword?id=${id}&oldPassword=${oldPassword}&password=${password}`)
    }

    deleteAccount(id){
        return axios.delete(`http://localhost:8080/api/systemEmployees/deleteById?id=${id}`)
    }
}