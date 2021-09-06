export const LOGIN = "LOGIN"
export const SIGN_OUT = "SIGN_OUT"
export const SYNC_USER = "SYNC_USER"
export const SYNC_EMPL_JOB_ADVERTS = "SYNC_EMPL_JOB_ADVERTS"
export const SYNC_CAND_CVS = "SYNC_CAND_CVS"
export const CHANGE_EMAIl = "CHANGE_EMAIl"
export const CHANGE_JOB_EXP = "CHANGE_JOB_EXP"
export const CHANGE_LANG = "CHANGE_LANG"
export const CHANGE_SCHOOL = "CHANGE_SCHOOL"
export const CHANGE_SKILL = "CHANGE_SKILL"
export const CHANGE_FAVORITE_JOB_ADVS = "CHANGE_FAVORITE_JOB_ADVS"
export const CHANGE_CV_JOB_EXP  = "CHANGE_CV_JOB_EXP"
export const CHANGE_CV_LANG  = "CHANGE_CV_LANG"
export const CHANGE_CV_SCHOOL  = "CHANGE_CV_SCHOOL"
export const CHANGE_CV_SKILL  = "CHANGE_CV_SKILL"

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

export function syncUser(user) {
    return {
        type: SYNC_USER,
        payload: {user}
    }
}

export function syncEmplJobAdverts(jobAdverts) {
    return {
        type: SYNC_EMPL_JOB_ADVERTS,
        payload: {jobAdverts: jobAdverts}
    }
}

export function syncCandCVs(CVs) {
    return {
        type: SYNC_CAND_CVS,
        payload: {CVs}
    }
}

export function changeEmail(email) {
    return {
        type: CHANGE_EMAIl,
        payload: {email}
    }
}

export function changeJobExps(jobExps) {
    return {
        type: CHANGE_JOB_EXP,
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

export function changeFavoriteJobAdvs(jobAdvs) {
    return {
        type: CHANGE_FAVORITE_JOB_ADVS,
        payload: {jobAdvs}
    }
}

export function changeCvJobExp(cvId, jobExps) {
    return {
        type: CHANGE_CV_JOB_EXP,
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
