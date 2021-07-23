import axios from "axios"

export default class CityService {

    getCities() {
        return axios.get("http://localhost:8080/api/cities/get/all");
    }

    addCity(cityName) {
        return axios.post(`http://localhost:8080/api/cities/add?cityName=${cityName}`)
    }

}