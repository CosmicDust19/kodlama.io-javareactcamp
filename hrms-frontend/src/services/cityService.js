import axios from "axios"

export default class CityService {

    getAll() {
        return axios.get("http://localhost:8080/api/cities/get/all");
    }

    add(cityName) {
        return axios.post(`http://localhost:8080/api/cities/add?cityName=${cityName}`)
    }

}