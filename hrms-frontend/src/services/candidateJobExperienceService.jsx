import axios from "axios"

export default class CandidateJobExperienceService {
    add(values) {
        return axios.post("http://localhost:8080/api/jobExperiences/add", values)
    }

    delete(id) {
        return axios.delete(`http://localhost:8080/api/jobExperiences/deleteById?id=${id}`)
    }
}