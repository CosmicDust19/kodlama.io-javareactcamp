import axios from "axios"

export default class SystemEmployeeService {
    getSystemEmployees(){
        return axios.get("http://localhost:8080/api/systemEmployees/getAll");
    }
}