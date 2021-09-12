import axios from "axios"

export default class CandidateService {

    existsByNationalityId(nationalityId) {
        return axios.get(`http://localhost:8080/api/candidates/exists/byNatId?nationalityId=${nationalityId}`)
    }

    getAll() {
        return axios.get("http://localhost:8080/api/candidates/get/all")
    }

    getById(candId) {
        return axios.get(`http://localhost:8080/api/candidates/get/byId?candId=${candId}`)
    }

    getByEmailAndPassword(email, password) {
        return axios.get(`http://localhost:8080/api/candidates/get/byEmailAndPW?email=${email}&password=${password}`)
    }

    add(values) {
        return axios.post("http://localhost:8080/api/candidates/add", values)
    }

    updateGithubAccount(candId, link) {
        return axios.put(`http://localhost:8080/api/candidates/update/githubAccount?candId=${candId}${link ? `&githubAccount=${link}` : ""}`)
    }

    updateLinkedinAccount(candId, link) {
        return axios.put(`http://localhost:8080/api/candidates/update/linkedinAccount?candId=${candId}${link ? `&linkedinAccount=${link}` : ""}`)
    }

    addJobAdvToFavorites(candId, jobAdvertisementId) {
        return axios.put(`http://localhost:8080/api/candidates/update/favoriteJobAdvs/add?candId=${candId}&jobAdvId=${jobAdvertisementId}`)
    }

    removeJobAdvFromFavorites(candId, jobAdvertisementId) {
        return axios.put(`http://localhost:8080/api/candidates/update/favoriteJobAdvs/remove?candId=${candId}&jobAdvId=${jobAdvertisementId}`)
    }

}