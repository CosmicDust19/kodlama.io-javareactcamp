import axios from "axios"

export default class CandidateCvService {
    getById(id){
        return axios.get(`http://localhost:8080/api/cvs/getById?id=${id}`)
    }

    add(values){
        return axios.post("http://localhost:8080/api/cvs/add",values)
    }

    delete(cvId){
        return axios.delete(`http://localhost:8080/api/cvs/deleteById?id=${cvId}`)
    }

    updateTitle(id, title){
        return axios.put(`http://localhost:8080/api/cvs/updateTitle?id=${id}&title=${title}`)
    }

    updateCoverLetter(id, coverLetter){
        if(!coverLetter) return axios.put(`http://localhost:8080/api/cvs/updateCoverLetter?id=${id}`)
        return axios.put(`http://localhost:8080/api/cvs/updateCoverLetter?coverLetter=${coverLetter}&id=${id}`)
    }

    updateJobExperiences(id, jobExperienceIds, updateType){
        let updateExp
        updateType === "delete" ? updateExp = "deleteFromCandidateCv": updateExp = "addToCandidateCv"
        let request = `http://localhost:8080/api/cvs/${updateExp}/JobExperiences?candidateCvId=${id}`
        jobExperienceIds.forEach((jobExperienceId) => request += `&candidateJobExperienceIds=${jobExperienceId}`)
        return axios.put(request)
    }

    updateLanguages(id, languageIds, updateType){
        let updateExp
        updateType === "delete" ? updateExp = "deleteFromCandidateCv": updateExp = "addToCandidateCv"
        let request = `http://localhost:8080/api/cvs/${updateExp}/Languages?candidateCvId=${id}`
        languageIds.forEach((languageId) => request += `&candidateLanguageIds=${languageId}`)
        return axios.put(request)
    }

    updateSchools(id, schoolIds, updateType){
        let updateExp
        updateType === "delete" ? updateExp = "deleteFromCandidateCv": updateExp = "addToCandidateCv"
        let request = `http://localhost:8080/api/cvs/${updateExp}/Schools?candidateCvId=${id}`
        schoolIds.forEach((schoolId) => request += `&candidateSchoolIds=${schoolId}`)
        return axios.put(request)
    }

    updateSkills(id, skillIds, updateType){
        let updateExp
        updateType === "delete" ? updateExp = "deleteFromCandidateCv": updateExp = "addToCandidateCv"
        let request = `http://localhost:8080/api/cvs/${updateExp}/Skills?candidateCvId=${id}`
        skillIds.forEach((skillId) => request += `&candidateSkillIds=${skillId}`)
        return axios.put(request)
    }

    /*syncJobExperiences(id, jobExperienceIds){
        let request = `http://localhost:8080/api/cvs/syncJobExperiencesInCandidateCv?candidateCvId=${id}`
        jobExperienceIds.forEach((jobExperienceId) => request += `&candidateJobExperienceIds=${jobExperienceId}`)
        return axios.put(request)
    }

    syncLanguages(id, languageIds){
        let request = `http://localhost:8080/api/cvs/syncLanguagesInCandidateCv?candidateCvId=${id}`
        languageIds.forEach((languageId) => request += `&candidateLanguageIds=${languageId}`)
        return axios.put(request)
    }

    syncSchools(id, schoolIds){
        let request = `http://localhost:8080/api/cvs/syncSchoolsInCandidateCv?candidateCvId=${id}`
        schoolIds.forEach((schoolId) => request += `&candidateSchoolIds=${schoolId}`)
        return axios.put(request)
    }

    syncSkills(id, skillIds){
        let request = `http://localhost:8080/api/cvs/syncSkillsInCandidateCv?candidateCvId=${id}`
        skillIds.forEach((skillId) => request += `&candidateSkillIds=${skillId}`)
        return axios.put(request)
    }*/

}
