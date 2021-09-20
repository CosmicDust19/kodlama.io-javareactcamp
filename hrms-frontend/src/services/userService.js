import axios from "axios"

export default class UserService {

    existsByEmail(email){
        return axios.get(`http://localhost:8080/api/users/exists/byEmail?email=${email}`)
    }

    existsByEmailAndPW(email, password){
        return axios.get(`http://localhost:8080/api/users/exists/byEmailAndPW?email=${email}&password=${password}`)
    }

    deleteById(userId) {
        return axios.delete(`http://localhost:8080/api/users/delete/byId?userId=${userId}`)
    }

    login(email, password) {
        return axios.get(`http://localhost:8080/api/users/login?email=${email}&password=${password}`)
    }

    updateEmail(userId, email){
        return axios.put(`http://localhost:8080/api/users/update/email?email=${email}&userId=${userId}`)
    }

    updatePassword(userId, password, oldPassword){
        return axios.put(`http://localhost:8080/api/users/update/pw?oldPassword=${oldPassword}&password=${password}&userId=${userId}`)
    }

    updateProfileImg(imgId, userId) {
        return axios.put(`http://localhost:8080/api/users/update/profileImg?${imgId ? `imgId=${imgId}&` : ""}userId=${userId}`)
    }

}