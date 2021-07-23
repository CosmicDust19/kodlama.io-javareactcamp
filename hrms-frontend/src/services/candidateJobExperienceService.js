import axios from "axios"

export default class CandidateJobExperienceService {

    add(values) {
        return axios.post("http://localhost:8080/api/candidateJobExperiences/add", values)
    }

    delete(candJobExpId) {
        return axios.delete(`http://localhost:8080/api/candidateJobExperiences/delete/byId?candJobExpId=${candJobExpId}`)
    }

}