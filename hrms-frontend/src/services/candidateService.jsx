import axios from "axios"

export default class CandidateService {

    existsByEmailAndPassword(email, password){
        return axios.get("http://localhost:8080/api/candidates/existsByEmailAndPassword?email=" + email + "&password=" + password)
    }

    existsByNationalityId(nationalityId){
        return axios.get("http://localhost:8080/api/candidates/existsByNationalityId?nationalityId=" + nationalityId)
    }

    getCandidates() {
        return axios.get("http://localhost:8080/api/candidates/getAll")
    }

    getById(id){
        return axios.get("http://localhost:8080/api/candidates/getById?id=" + id)
    }

    getByEmailAndPassword(email, password){
        return axios.get("http://localhost:8080/api/candidates/getByEmailAndPassword?email=" + email +  "&password=" + password)
    }

    add(values){
        return axios.post("http://localhost:8080/api/candidates/add",values)
    }
}