import axios from "axios";

export default class ImageService {

    getById(imgId) {
        return axios.get(`http://localhost:8080/api/images/get/byId?imgId=${imgId}`)
    }

    upload(userId, multipart) {
        return axios.post(`http://localhost:8080/api/images/upload?userId=${userId}`, multipart)
    }

    deleteById(imgId) {
        return axios.delete(`http://localhost:8080/api/images/delete/byId?imgId=${imgId}`)
    }

}