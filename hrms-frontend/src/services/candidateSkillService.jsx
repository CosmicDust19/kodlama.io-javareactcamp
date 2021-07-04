import axios from "axios"

export default class CandidateSkillService {
    add(values) {
        return axios.post("http://localhost:8080/api/candidateSkills/add", values)
    }

    delete(id) {
        return axios.delete(`http://localhost:8080/api/candidateSkills/deleteById?id=${id}`)
    }
}