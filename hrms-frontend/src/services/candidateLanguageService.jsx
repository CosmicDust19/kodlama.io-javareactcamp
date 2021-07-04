import axios from "axios"

export default class CandidateLanguageService {
    add(values) {
        return axios.post("http://localhost:8080/api/cvsLanguages/add", values)
    }

    delete(id) {
        return axios.delete(`http://localhost:8080/api/cvsLanguages/deleteById?id=${id}`)
    }
}