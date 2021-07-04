import axios from "axios"

export default class CandidateSchoolService {
    add(values) {
        return axios.post("http://localhost:8080/api/candidateSchools/add", values)
    }

    delete(id) {
        return axios.delete(`http://localhost:8080/api/candidateSchools/deleteById?id=${id}`)
    }
}