import axios from "axios"

export default class CandidateService {

    existsByEmailAndPassword(email, password){
        return axios.get(`http://localhost:8080/api/candidates/existsByEmailAndPassword?email=${email}&password=${password}`)
    }

    existsByNationalityId(nationalityId){
        return axios.get(`http://localhost:8080/api/candidates/existsByNationalityId?nationalityId=${nationalityId}`)
    }

    getCandidates() {
        return axios.get("http://localhost:8080/api/candidates/getAll")
    }

    getById(id){
        return axios.get(`http://localhost:8080/api/candidates/getById?id=${id}`)
    }

    getByEmailAndPassword(email, password){
        return axios.get(`http://localhost:8080/api/candidates/getByEmailAndPassword?email=${email}&password=${password}`)
    }

    add(values){
        return axios.post("http://localhost:8080/api/candidates/add",values)
    }

    updateEmail(id, email){
        return axios.put(`http://localhost:8080/api/candidates/updateEmail?email=${email}&id=${id}`)
    }

    updatePassword(id, password, oldPassword){
        return axios.put(`http://localhost:8080/api/candidates/updatePassword?id=${id}&oldPassword=${oldPassword}&password=${password}`)
    }

    updateGithubAccountLink(id, link){
        if(!link) return axios.put(`http://localhost:8080/api/candidates/updateGithubAccountLink?id=${id}`)
        return axios.put(`http://localhost:8080/api/candidates/updateGithubAccountLink?githubAccountLink=${link}&id=${id}`)
    }

    updateLinkedinAccount(id, link){
        if(!link) return axios.put(`http://localhost:8080/api/candidates/updateLinkedinAccountLink?id=${id}`)
        return axios.put(`http://localhost:8080/api/candidates/updateLinkedinAccountLink?id=${id}&linkedinAccountLink=${link}`)
    }

    deleteAccount(id){
        return axios.delete(`http://localhost:8080/api/candidates/deleteById?id=${id}`)
    }
}