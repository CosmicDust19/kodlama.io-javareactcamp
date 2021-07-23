import axios from "axios"

export default class SystemEmployeeService {

    getAll() {
        return axios.get("http://localhost:8080/api/systemEmployees/get/all");
    }

    getById(sysEmplId) {
        return axios.get(`http://localhost:8080/api/systemEmployees/get/byId?sysEmplId=${sysEmplId}`);
    }

    getByEmailAndPassword(email, password) {
        return axios.get(`http://localhost:8080/api/systemEmployees/get/byEmailAndPW?email=${email}&password=${password}`)
    }

    add(values) {
        return axios.post("http://localhost:8080/api/systemEmployees/add", values)
    }

    updateFirstName(sysEmplId, firstName) {
        return axios.put(`http://localhost:8080/api/systemEmployees/update/firstName?firstName=${firstName}&sysEmplId=${sysEmplId}`)
    }

    updateLastName(sysEmplId, lastName) {
        return axios.put(`http://localhost:8080/api/systemEmployees/update/lastName?lastName=${lastName}&sysEmplId=${sysEmplId}`)
    }

}