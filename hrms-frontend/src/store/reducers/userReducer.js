import {userProps} from "../initialStates/userProps";
import {
    LOGIN,
    SIGN_OUT,
    CHANGE_EMAIl,

    CHANGE_JOB_EXP,
    CHANGE_LANG,
    CHANGE_SCHOOL,
    CHANGE_SKILL,
    CHANGE_FAVORITE_JOB_ADVS,
    CHANGE_CV_JOB_EXP,
    CHANGE_CV_LANG,
    CHANGE_CV_SCHOOL,
    CHANGE_CV_SKILL,

    SYNC_USER,
    SYNC_EMPL_JOB_ADVERTS,
    SYNC_CAND_CVS
} from "../actions/userActions";

const initialState = {
    userProps: userProps
}

export default function userReducer(state = initialState, {type, payload}) {

    switch (type) {
        case LOGIN:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: payload.user,
                    userType: payload.userType,
                    loggedIn: true, guest: false
                }
            }
        case SIGN_OUT:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: null,
                    userType: null,
                    loggedIn: false
                }
            }
        case SYNC_USER:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: payload.user
                }
            }
        case SYNC_EMPL_JOB_ADVERTS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, jobAdvertisements: payload.jobAdverts}
                }
            }
        case SYNC_CAND_CVS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, cvs: payload.CVs}
                }
            }
        case CHANGE_EMAIl:
            state.userProps.user.email = payload.email
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, email: payload.email}
                }
            }
        case CHANGE_JOB_EXP:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, candidateJobExperiences: payload.jobExps}
                }
            }
        case CHANGE_LANG:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, candidateLanguages: payload.langs}
                }
            }
        case CHANGE_SCHOOL:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, candidateSchools: payload.schools}
                }
            }
        case CHANGE_SKILL:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, candidateSkills: payload.skills}
                }
            }
        case CHANGE_FAVORITE_JOB_ADVS:
            state.userProps.user.favoriteJobAdvertisements = payload.jobAdvs
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, favoriteJobAdvertisements: payload.jobAdvs}
                }
            }
        case CHANGE_CV_JOB_EXP: {
            const index = state.userProps.user.cvs.findIndex(cv => cv.id === payload.cvId)
            state.userProps.user.cvs[index].candidateJobExperiences = payload.jobExps
            return {...state}
        }
        case CHANGE_CV_LANG: {
            const index = state.userProps.user.cvs.findIndex(cv => cv.id === payload.cvId)
            state.userProps.user.cvs[index].candidateLanguages = payload.cvLangs
            return {...state}
        }
        case CHANGE_CV_SCHOOL: {
            const index = state.userProps.user.cvs.findIndex(cv => cv.id === payload.cvId)
            state.userProps.user.cvs[index].candidateSchools = payload.cvSchools
            return {...state}
        }
        case CHANGE_CV_SKILL: {
            const index = state.userProps.user.cvs.findIndex(cv => cv.id === payload.cvId)
            state.userProps.user.cvs[index].candidateSkills = payload.cvSkills
            return {...state}
        }
        default:
            return state
    }
}