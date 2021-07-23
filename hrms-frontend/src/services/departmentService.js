import axios from "axios"

export default class DepartmentService {

    getDepartments() {
        return axios.get("http://localhost:8080/api/departments/get/all");
    }

    addDepartment(departmentName) {
        return axios.post(`http://localhost:8080/api/departments/add?departmentName=${departmentName}`)
    }

}