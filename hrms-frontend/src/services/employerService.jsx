import axios from "axios"

export default class EmployerService {
    existsByEmailAndPassword(email, password){
        return axios.get("http://localhost:8080/api/employers/existsByEmailAndPassword?email=" + email + "&password=" + password)
    }

    existsByCompanyName(companyName){
        return axios.get("http://localhost:8080/api/employers/existsByCompanyName?companyName=" + companyName)
    }

    existsByWebsite(website){
        return axios.get("http://localhost:8080/api/employers/existsByWebsite?website=" + website)
    }

    getEmployers(){
        return axios.get("http://localhost:8080/api/employers/getAll");
    }

    getById(id){
        return axios.get("http://localhost:8080/api/employers/getById?id=" + id);
    }

    getByEmailAndPassword(email, password){
        return axios.get("http://localhost:8080/api/employers/getByEmailAndPassword?email=" + email +  "&password=" + password)
    }

    add(values){
        return axios.post("http://localhost:8080/api/employers/add",values)
    }
}