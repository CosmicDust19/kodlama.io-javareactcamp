export const LOGIN = "LOGIN"
export const SIGN_OUT = "SIGN_OUT"
export const CHANGE_FIRSTNAME = "CHANGE_FIRSTNAME"
export const CHANGE_LASTNAME = "CHANGE_LASTNAME"
export const CHANGE_EMAIl = "CHANGE_EMAIl"
export const CHANGE_GITHUB = "CHANGE_GITHUB"
export const CHANGE_LINKEDIN = "CHANGE_LINKEDIN"
export const CHANGE_JOBEXP = "CHANGE_JOBEXP"
export const CHANGE_LANG = "CHANGE_LANG"
export const CHANGE_SCHOOL = "CHANGE_SCHOOL"
export const CHANGE_SKILL = "CHANGE_SKILL"
export const CHANGE_FAVORITE_JOB_ADVS = "CHANGE_FAVORITE_JOB_ADVS"
export const CHANGE_CV_COVERLETTER = "CHANGE_CV_COVERLETTER"
export const CHANGE_CV_TITLE = "CHANGE_CV_TITLE"
export const CHANGE_CV_JOBEXP  = "CHANGE_CV_JOBEXP"
export const CHANGE_CV_LANG  = "CHANGE_CV_LANG"
export const CHANGE_CV_SCHOOL  = "CHANGE_CV_SCHOOL"
export const CHANGE_CV_SKILL  = "CHANGE_CV_SKILL"
export const ADD_CV  = "ADD_CV"
export const DELETE_CV  = "DELETE_CV"
export const CHANGE_WEBSITE = "CHANGE_WEBSITE"
export const CHANGE_COMP_NAME = "CHANGE_COMP_NAME"
export const CHANGE_PHONE = "CHANGE_PHONE"
export const CHANGE_EMPLOYER_UPDATE = "CHANGE_EMPLOYER_UPDATE"

export function login(user, userType) {
    return {
        type: LOGIN,
        payload: {user, userType}
    }
}

export function signOut() {
    return {
        type: SIGN_OUT
    }
}

export function changeFirstName(firstName) {
    return {
        type: CHANGE_FIRSTNAME,
        payload: {firstName}
    }
}

export function changeLastName(lastName) {
    return {
        type: CHANGE_LASTNAME,
        payload: {lastName}
    }
}

export function changeEmail(email) {
    return {
        type: CHANGE_EMAIl,
        payload: {email}
    }
}

export function changeGithub(link) {
    return {
        type: CHANGE_GITHUB,
        payload: {link}
    }
}

export function changeLinkedin(link) {
    return {
        type: CHANGE_LINKEDIN,
        payload: {link}
    }
}

export function changeJobExps(jobExps) {
    return {
        type: CHANGE_JOBEXP,
        payload: {jobExps}
    }
}

export function changeLangs(langs) {
    return {
        type: CHANGE_LANG,
        payload: {langs}
    }
}

export function changeSchools(schools) {
    return {
        type: CHANGE_SCHOOL,
        payload: {schools}
    }
}

export function changeSkills(skills) {
    return {
        type: CHANGE_SKILL,
        payload: {skills}
    }
}

export function changeFavoriteJobAdv(jobAdvs) {
    return {
        type: CHANGE_FAVORITE_JOB_ADVS,
        payload: {jobAdvs}
    }
}

export function changeTitle(cvId, title) {
    return {
        type: CHANGE_CV_TITLE,
        payload: {cvId, title}
    }
}

export function changeCoverLetter(cvId, coverLetter) {
    return {
        type: CHANGE_CV_COVERLETTER,
        payload: {cvId, coverLetter}
    }
}

export function changeCvJobExp(cvId, jobExps) {
    return {
        type: CHANGE_CV_JOBEXP,
        payload: {cvId, jobExps}
    }
}

export function changeCvLang(cvId, cvLangs) {
    return {
        type: CHANGE_CV_LANG,
        payload: {cvId, cvLangs}
    }
}

export function changeCvSchool(cvId, cvSchools) {
    return {
        type: CHANGE_CV_SCHOOL,
        payload: {cvId, cvSchools}
    }
}

export function changeCvSkill(cvId, cvSkills) {
    return {
        type: CHANGE_CV_SKILL,
        payload: {cvId, cvSkills}
    }
}

export function changeEmployerUpdate (employerUpdate){
    return {
        type: CHANGE_EMPLOYER_UPDATE,
        payload: {employerUpdate}
    }
}

export function changeWebsite(website) {
    return {
        type: CHANGE_WEBSITE,
        payload: {website}
    }
}

export function changeCompName(companyName) {
    return {
        type: CHANGE_COMP_NAME,
        payload: {companyName}
    }
}

export function changePhone(phone) {
    return {
        type: CHANGE_PHONE,
        payload: {phone}
    }
}

export function addCv(CV) {
    return {
        type: ADD_CV,
        payload: {CV}
    }
}

export function deleteCv(cvId) {
    return {
        type: DELETE_CV,
        payload: {cvId}
    }
}