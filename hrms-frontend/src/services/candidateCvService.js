import axios from "axios"

export default class CandidateCvService {

    getById(cvId) {
        return axios.get(`http://localhost:8080/api/cvs/get/byId?cvId=${cvId}`)
    }

    add(values) {
        return axios.post("http://localhost:8080/api/cvs/add", values)
    }

    deleteById(cvId) {
        return axios.delete(`http://localhost:8080/api/cvs/delete/byId?cvId=${cvId}`)
    }

    updateTitle(cvId, title) {
        return axios.put(`http://localhost:8080/api/cvs/update/title?cvId=${cvId}&title=${title}`)
    }

    updateCoverLetter(cvId, coverLetter) {
        if (!coverLetter || coverLetter === "") return axios.put(`http://localhost:8080/api/cvs/update/coverLetter?cvId=${cvId}`)
        return axios.put(`http://localhost:8080/api/cvs/update/coverLetter?coverLetter=${coverLetter}&cvId=${cvId}`)
    }

    updateImg(imgId, cvId) {
        return axios.put(`http://localhost:8080/api/cvs/update/image?cvId=${cvId}&${imgId ? `imgId=${imgId}` : ""}`)
    }

    updateJobExperiences(cvId, jobExpIds, updateType) {
        return axios.put(`http://localhost:8080/api/cvs/update/jobExps/${this.getUpdateExp(updateType)}?${this.getCvPropIdListExp(jobExpIds, "candJobExpIds")}cvId=${cvId}`)
    }

    updateLanguages(cvId, langIds, updateType) {
        return axios.put(`http://localhost:8080/api/cvs/update/langs/${this.getUpdateExp(updateType)}?${this.getCvPropIdListExp(langIds, "candLangIds")}cvId=${cvId}`)
    }

    updateSchools(cvId, schoolIds, updateType) {
        return axios.put(`http://localhost:8080/api/cvs/update/schools/${this.getUpdateExp(updateType)}?${this.getCvPropIdListExp(schoolIds, "candSchoolIds")}cvId=${cvId}`)
    }

    updateSkills(cvId, skillIds, updateType) {
        return axios.put(`http://localhost:8080/api/cvs/update/skills/${this.getUpdateExp(updateType)}?${this.getCvPropIdListExp(skillIds, "candSkillIds")}cvId=${cvId}`)
    }

    getCvPropIdListExp(propIds, propIdName) {
        let exp = ""
        propIds.forEach((propId) => exp += `${propIdName}=${propId}&`)
        return exp
    }

    getUpdateExp(updateType) {
        if (updateType === "remove") return "remove"
        else return "add"
    }

}
