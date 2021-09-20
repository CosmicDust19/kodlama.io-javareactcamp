import axios from "axios"

export default class SchoolService {

    getAll() {
        return axios.get("http://localhost:8080/api/schools/get/all");
    }

    add(schoolName) {
        return axios.post(`http://localhost:8080/api/schools/add?schoolName=${schoolName}`)
    }

}