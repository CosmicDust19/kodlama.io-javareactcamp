import {userProps} from "../initialStates/userProps";
import {
    CHANGE_CAND_CVS, CHANGE_EMAIl, CHANGE_EMPL_JOB_ADVERTS, CHANGE_FAVORITE_JOB_ADVS, CHANGE_IMAGES, CHANGE_JOB_EXPS, CHANGE_LANGS,
    CHANGE_SCHOOLS, CHANGE_SKILLS, LOGIN, SIGN_OUT, SYNC_USER
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
                    user: {...payload.user},
                    userType: payload.userType,
                    loggedIn: true, lastLogin: new Date().getTime(),
                    lastSynced: new Date().getTime()
                }
            }
        case SIGN_OUT:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: null, userType: null, loggedIn: false, lastLogin: null
                }
            }
        case SYNC_USER:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...payload.user},
                    lastSynced: payload.synced === true ? new Date().getTime() : state.userProps.lastSynced
                },
            }
        case CHANGE_IMAGES:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, images: [...payload.images]}
                }
            }
        case CHANGE_EMPL_JOB_ADVERTS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, jobAdvertisements: [...payload.jobAdverts]}
                }
            }
        case CHANGE_CAND_CVS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, cvs: [...payload.CVs]}
                }
            }
        case CHANGE_EMAIl:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, email: payload.email}
                }
            }
        case CHANGE_JOB_EXPS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, candidateJobExperiences: [...payload.jobExps]}
                }
            }
        case CHANGE_LANGS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, candidateLanguages: [...payload.langs]}
                }
            }
        case CHANGE_SCHOOLS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, candidateSchools: [...payload.schools]}
                }
            }
        case CHANGE_SKILLS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, candidateSkills: [...payload.skills]}
                }
            }
        case CHANGE_FAVORITE_JOB_ADVS:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: {...state.userProps.user, favoriteJobAdvertisements: [...payload.jobAdvs]}
                }
            }
        default:
            return state
    }
}