import axios from "axios"

export default class LanguageService {

    getLanguages() {
        return axios.get("http://localhost:8080/api/languages/get/all");
    }

    addLanguage(languageName) {
        return axios.post(`http://localhost:8080/api/languages/add?languageName=${languageName}`)
    }

}