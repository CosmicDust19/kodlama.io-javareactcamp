import axios from "axios"

export default class CandidateLanguageService {

    add(values) {
        return axios.post("http://localhost:8080/api/candidateLanguages/add", values)
    }

    delete(candLangId) {
        return axios.delete(`http://localhost:8080/api/candidateLanguages/delete/byId?CandLangId=${candLangId}`)
    }

}