import axios from "axios"

export default class SchoolService {

    getSchools() {
        return axios.get("http://localhost:8080/api/schools/get/all");
    }

    addSchool(schoolName) {
        return axios.post(`http://localhost:8080/api/schools/add?schoolName=${schoolName}`)
    }

}