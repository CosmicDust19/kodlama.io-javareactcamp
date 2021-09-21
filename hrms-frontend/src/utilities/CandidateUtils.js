import {changePropInList} from "./Utils";
import CandidateService from "../services/candidateService";
import {toast} from "react-toastify";
import {changeCandCVs, syncUser} from "../store/actions/userActions";

const candidateService = new CandidateService()

export const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"]

export const languageLevelOption = languageLevels.map((languageLevel, index) => ({
    key: index,
    text: languageLevel,
    value: languageLevel,
}));

export const onPropAdd = (dispatch, newProp, oldProps, saveFunction) => {
    oldProps.push(newProp)
    dispatch(saveFunction(oldProps))
    toast("Added")
}

export const syncCandidate = (dispatch, userId) => {
    candidateService.getById(userId).then(r => dispatch(syncUser(r.data.data, true)))
    toast("Removed")
}

export const onCVUpdate = (dispatch, cvId, oldCVs, response, msg) => {
    const CVs = changePropInList(cvId, response.data.data, oldCVs)
    dispatch(changeCandCVs(CVs))
    toast(msg)
}

export const getFilteredCandJobExpOption = (candJobExps, filterCandJobExps) =>
    candJobExps?.filter((candJobExp) => {
        const index = (filterCandJobExps?.findIndex((filterCandJobExp) => filterCandJobExp.id === candJobExp.id))
        return index === -1;
    }).map((candidateJobExp, index) => ({
        key: index,
        text: `${candidateJobExp.workPlace} | ${candidateJobExp.position.title}`,
        value: candidateJobExp.id,
    }));

export const getFilteredCandLangOption = (candLangs, filterCandLangs) =>
    candLangs?.filter((candLang) => {
        const index = (filterCandLangs?.findIndex((filterCandLang) => filterCandLang.id === candLang.id))
        return index === -1;
    }).map((candidateLanguage, index) => ({
        key: index,
        text: `${candidateLanguage.language.name} | ${candidateLanguage.languageLevel}`,
        value: candidateLanguage.id,
    }));

export const getFilteredCandSchOption = (candSchs, filterCandSchs) =>
    candSchs?.filter((candSch) => {
        const index = (filterCandSchs?.findIndex((filterCandSch) => filterCandSch.id === candSch.id))
        return index === -1;
    }).map((candidateSchool, index) => ({
        key: index,
        text: `${candidateSchool.school.name} | ${candidateSchool.department.name}`,
        value: candidateSchool.id,
    }));

export const getFilteredCandSkillOption = (candSkills, filterCandSkills) =>
    candSkills?.filter((candSkill) => {
        const index = (filterCandSkills?.findIndex((filterCandSkill) => filterCandSkill.id === candSkill.id))
        return index === -1;
    }).map((candidateSkill, index) => ({
        key: index,
        text: candidateSkill.skill.name,
        value: candidateSkill.id,
    }));

export const getFilteredLanguageOption = (languages, candidateLanguages) =>
    languages.filter((language) => {
        const index = (candidateLanguages.findIndex(candLang => candLang.language.id === language.id))
        return index === -1;
    }).map((language, index) => ({
        key: index,
        text: language.name,
        value: language.id,
    }));

export const getFilteredSkillOption = (skills, candidateSkills) =>
    skills.filter((skill) => {
        const index = (candidateSkills.findIndex(candSkill => candSkill.skill.id === skill.id))
        return index === -1;
    }).map((skill, index) => ({
        key: index,
        text: skill.name,
        value: skill.id,
    }));


