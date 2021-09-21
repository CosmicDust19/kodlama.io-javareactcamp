export const LOGIN = "LOGIN"
export const SIGN_OUT = "SIGN_OUT"
export const SYNC_USER = "SYNC_USER"
export const CHANGE_IMAGES = "CHANGE_IMAGES"
export const CHANGE_EMPL_JOB_ADVERTS = "CHANGE_EMPL_JOB_ADVERTS"
export const CHANGE_CAND_CVS = "CHANGE_CAND_CVS"
export const CHANGE_EMAIl = "CHANGE_EMAIl"
export const CHANGE_JOB_EXPS = "CHANGE_JOB_EXPS"
export const CHANGE_LANGS = "CHANGE_LANGS"
export const CHANGE_SCHOOLS = "CHANGE_SCHOOLS"
export const CHANGE_SKILLS = "CHANGE_SKILLS"
export const CHANGE_FAVORITE_JOB_ADVS = "CHANGE_FAVORITE_JOB_ADVS"

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

export function syncUser(user, synced) {
    return {
        type: SYNC_USER,
        payload: {user, synced}
    }
}

export function changeImages(images) {
    return {
        type: CHANGE_IMAGES,
        payload: {images: images}
    }
}

export function changeEmplJobAdverts(jobAdverts) {
    return {
        type: CHANGE_EMPL_JOB_ADVERTS,
        payload: {jobAdverts: jobAdverts}
    }
}

export function changeCandCVs(CVs) {
    return {
        type: CHANGE_CAND_CVS,
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
        type: CHANGE_JOB_EXPS,
        payload: {jobExps}
    }
}

export function changeLangs(langs) {
    return {
        type: CHANGE_LANGS,
        payload: {langs}
    }
}

export function changeSchools(schools) {
    return {
        type: CHANGE_SCHOOLS,
        payload: {schools}
    }
}

export function changeSkills(skills) {
    return {
        type: CHANGE_SKILLS,
        payload: {skills}
    }
}

export function changeFavoriteJobAdvs(jobAdvs) {
    return {
        type: CHANGE_FAVORITE_JOB_ADVS,
        payload: {jobAdvs}
    }
}
