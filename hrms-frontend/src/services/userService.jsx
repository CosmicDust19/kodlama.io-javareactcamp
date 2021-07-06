import axios from "axios"

export default class UserService {
    existsByEmail(email){
        return axios.get(`http://localhost:8080/api/users/existsByEmail?email=${email}`)
    }
}