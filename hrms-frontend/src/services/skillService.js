import axios from "axios"

export default class SkillService {

    getSkills() {
        return axios.get("http://localhost:8080/api/skills/get/all");
    }

    addSkill(skillName) {
        return axios.post(`http://localhost:8080/api/skills/add?skillName=${skillName}`)
    }

}