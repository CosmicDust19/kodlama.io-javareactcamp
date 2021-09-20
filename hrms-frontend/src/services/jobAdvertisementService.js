import axios from "axios"

export default class JobAdvertisementService {

    getAll(propName, sortDirection) {
        const params = propName && sortDirection ? `propName=${propName}&sortDirection=${sortDirection}` : undefined
        return axios.get(`http://localhost:8080/api/jobAdvertisements/get/all?${params ? params : undefined}`);
    }

    getAllByEmployerId(employerId) {
        return axios.get(`http://localhost:8080/api/jobAdvertisements/get/byEmployer?employerId=${employerId}`);
    }

    getPublic(propName, sortDirection) {
        const params = propName && sortDirection ? `propName=${propName}&sortDirection=${sortDirection}` : undefined
        return axios.get(`http://localhost:8080/api/jobAdvertisements/get/public?${params ? params : undefined}`);
    }

    getPublicByEmployerId(employerId, propName, sortDirection) {
        const params = propName && sortDirection ? `propName=${propName}&sortDirection=${sortDirection}` : undefined
        return axios.get(`http://localhost:8080/api/jobAdvertisements/get/publicByEmployer?employerId=${employerId}&${params ? params : undefined}`);
    }

    getById(jobAdvId) {
        return axios.get(`http://localhost:8080/api/jobAdvertisements/get/byId?jobAdvId=${jobAdvId}`);
    }

    deleteById(jobAdvId) {
        return axios.delete(`http://localhost:8080/api/jobAdvertisements/delete/byId?jobAdvId=${jobAdvId}`);
    }

    add(values) {
        return axios.post("http://localhost:8080/api/jobAdvertisements/add", values);
    }

    update(values) {
        return axios.put("http://localhost:8080/api/jobAdvertisements/update", values);
    }

    updatePosition(jobAdvId, positionId) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/position?jobAdvId=${jobAdvId}&positionId=${positionId}`);
    }

    updateCity(jobAdvId, cityId) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/city?cityId=${cityId}&jobAdvId=${jobAdvId}`);
    }

    updateWorkModel(jobAdvId, workModel) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/workModel?jobAdvId=${jobAdvId}&workModel=${workModel}`);
    }

    updateWorkTime(jobAdvId, workTime) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/workTime?jobAdvId=${jobAdvId}&workTime=${workTime}`);
    }

    updateMinSalary(jobAdvId, minSalary) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/minSalary?jobAdvId=${jobAdvId}&minSalary=${minSalary}`);
    }

    updateMaxSalary(jobAdvId, maxSalary) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/maxSalary?jobAdvId=${jobAdvId}&maxSalary=${maxSalary}`);
    }

    updateJobDesc(jobAdvId, description) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/jobDesc?jobAdvId=${jobAdvId}&jobDescription=${description}`);
    }

    updateDeadline(jobAdvId, deadline) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/deadLine?deadLine=${deadline}&jobAdvId=${jobAdvId}`);
    }

    updateOpenPositions(jobAdvId, number) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/openPositions?jobAdvId=${jobAdvId}&number=${number}`);
    }

    applyChanges(jobAdvId) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/applyChanges?jobAdvId=${jobAdvId}`);
    }

    updateVerification(id, status) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/verification?jobAdvId=${id}&status=${status}`);
    }

    updateActivation(id, status) {
        return axios.put(`http://localhost:8080/api/jobAdvertisements/update/activation?jobAdvId=${id}&status=${status}`);
    }

}