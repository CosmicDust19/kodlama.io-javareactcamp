import axios from "axios"

export default class JobAdvertisementService {
    getAllJobAdvertisements() {
        return axios.get("http://localhost:8080/api/jobAdvertisements/getAll");
    }

    getJobAdvertisements() {
        return axios.get("http://localhost:8080/api/jobAdvertisements/getPublicJobs");
    }

    getEmployerJobs(id) {
        return axios.get(`http://localhost:8080/api/jobAdvertisements/getPublicEmployerJobs?employerId=${id}`);
    }

    getById(id) {
        return axios.get(`http://localhost:8080/api/jobAdvertisements/getById?jobAdvertisementId=${id}`);
    }

    add(values){
        return axios.post("http://localhost:8080/api/jobAdvertisements/add",values)
    }

    updatePosition(id, positionId){
        return axios.put(`http://localhost:8080/api/jobAdvertisements/updatePosition?id=${id}&positionId=${positionId}`)
    }

    updateCity(id, cityId){
        return axios.put(`http://localhost:8080/api/jobAdvertisements/updateCity?cityId=${cityId}&id=${id}`)
    }

    updateWorkModel(id, workModel){
        return axios.put(`http://localhost:8080/api/jobAdvertisements/updateWorkModel?id=${id}&workModel=${workModel}`)
    }

    updateWorkTime(id, workTime){
        return axios.put(`http://localhost:8080/api/jobAdvertisements/updateWorkTime?id=${id}&workTime=${workTime}`)
    }

    updateMinSalary(id, minSalary){
        return axios.put(`http://localhost:8080/api/jobAdvertisements/updateMinSalary?id=${id}&minSalary=${minSalary}`)
    }

    updateMaxSalary(id, maxSalary){
        return axios.put(`http://localhost:8080/api/jobAdvertisements/updateMaxSalary?id=${id}&maxSalary=${maxSalary}`)
    }

    updateJobDesc(id, description){
        return axios.put(`http://localhost:8080/api/jobAdvertisements/updateJobDescription?id=${id}&jobDescription=${description}`)
    }

    updateSystemVerificationStatus(id, status){
        return axios.put(`http://localhost:8080/api/jobAdvertisements/updateSystemVerificationStatus?id=${id}&systemVerificationStatus=${status}`)
    }

}