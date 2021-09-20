import axios from "axios"

export default class SkillService {

    getAll() {
        return axios.get("http://localhost:8080/api/skills/get/all");
    }

    add(skillName) {
        return axios.post(`http://localhost:8080/api/skills/add?skillName=${skillName}`)
    }

}