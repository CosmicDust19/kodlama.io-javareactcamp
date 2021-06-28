import axios from "axios"

export default class CandidateCvService {
    getById(id){
        return axios.get("http://localhost:8080/api/cvs/getById?id=" + id)
    }
}