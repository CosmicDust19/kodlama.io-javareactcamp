import axios from "axios"

export default class JobAdvertisementService {
    getJobAdvertisements() {
        return axios.get("http://localhost:8080/api/jobAdvertisements/getAllActives");
    }

    getById(id) {
        return axios.get("http://localhost:8080/api/jobAdvertisements/getById?jobAdvertisementId=" + id);
    }

    add(values){
        return axios.post("http://localhost:8080/api/jobAdvertisements/add",values)
    }
}