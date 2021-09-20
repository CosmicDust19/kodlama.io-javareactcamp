import axios from "axios"

export default class DepartmentService {

    getAll() {
        return axios.get("http://localhost:8080/api/departments/get/all");
    }

    add(departmentName) {
        return axios.post(`http://localhost:8080/api/departments/add?departmentName=${departmentName}`)
    }

}