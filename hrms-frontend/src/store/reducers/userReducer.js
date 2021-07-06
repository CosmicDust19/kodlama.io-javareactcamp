import {userProps} from "../initialStates/userProps";
import {
    LOGIN,
    SIGN_OUT,
    CHANGE_EMAIl,
    CHANGE_GITHUB,
    CHANGE_LINKEDIN,
    CHANGE_CV_TITLE,
    CHANGE_CV_COVERLETTER,
    CHANGE_CV_JOBEXP,
    CHANGE_CV_LANG,
    CHANGE_CV_SCHOOL,
    CHANGE_CV_SKILL,
    ADD_CV,
    DELETE_CV,
    CHANGE_JOBEXP,
    CHANGE_LANG,
    CHANGE_SCHOOL, CHANGE_SKILL, CHANGE_FAVORITE_JOB_ADVS, CHANGE_FIRSTNAME, CHANGE_LASTNAME
} from "../actions/userActions";

const initialState = {
    userProps: userProps
}

export default function userReducer(state = initialState, {type, payload}) {

    switch (type) {
        case LOGIN:
            state.userProps.user = payload.user
            state.userProps.userType = payload.userType
            state.userProps.loggedIn = true
            return {...state}
        case SIGN_OUT:
            state.userProps.user = null
            state.userProps.userType = null
            state.userProps.loggedIn = false
            return {...state}
        case CHANGE_FIRSTNAME:
            state.userProps.user.firstName = payload.firstName
            return {...state}
        case CHANGE_LASTNAME:
            state.userProps.user.lastName = payload.lastName
            return {...state}
        case CHANGE_EMAIl:
            state.userProps.user.email = payload.email
            return {...state}
        case CHANGE_GITHUB:
            state.userProps.user.githubAccountLink = payload.link
            return {...state}
        case CHANGE_LINKEDIN:
            state.userProps.user.linkedinAccountLink = payload.link
            return {...state}
        case CHANGE_JOBEXP:
            state.userProps.user.candidateJobExperiences = payload.jobExps
            return {...state}
        case CHANGE_LANG:
            state.userProps.user.candidateLanguages = payload.langs
            return {...state}
        case CHANGE_SCHOOL:
            state.userProps.user.candidateSchools = payload.schools
            return {...state}
        case CHANGE_SKILL:
            state.userProps.user.candidateSkills = payload.skills
            return {...state}
        case CHANGE_FAVORITE_JOB_ADVS:
            state.userProps.user.favoriteJobAdvertisements = payload.jobAdvs
            return {...state}
        case CHANGE_CV_TITLE: {
            let index = state.userProps.user.candidateCvs.findIndex(candidateCv => {
                return candidateCv.id === payload.cvId
            })
            state.userProps.user.candidateCvs[index].title = payload.title
            return {...state}
        }
        case CHANGE_CV_COVERLETTER: {
            let index = state.userProps.user.candidateCvs.findIndex(candidateCv => {
                return candidateCv.id === payload.cvId
            })
            state.userProps.user.candidateCvs[index].coverLetter = payload.coverLetter
            return {...state}
        }
        case CHANGE_CV_JOBEXP: {
            let index = state.userProps.user.candidateCvs.findIndex(candidateCv => {
                return candidateCv.id === payload.cvId
            })
            state.userProps.user.candidateCvs[index].candidateJobExperiences = payload.jobExps
            return {...state}
        }
        case CHANGE_CV_LANG: {
            let index = state.userProps.user.candidateCvs.findIndex(candidateCv => {
                return candidateCv.id === payload.cvId
            })
            state.userProps.user.candidateCvs[index].candidateLanguages = payload.cvLangs
            return {...state}
        }
        case CHANGE_CV_SCHOOL: {
            let index = state.userProps.user.candidateCvs.findIndex(candidateCv => {
                return candidateCv.id === payload.cvId
            })
            state.userProps.user.candidateCvs[index].candidateSchools = payload.cvSchools
            return {...state}
        }
        case CHANGE_CV_SKILL: {
            let index = state.userProps.user.candidateCvs.findIndex(candidateCv => {
                return candidateCv.id === payload.cvId
            })
            state.userProps.user.candidateCvs[index].candidateSkills = payload.cvSkills
            return {...state}
        }
        case ADD_CV: {
            state.userProps.user.candidateCvs.push(payload.CV)
            return {...state}
        }
        case DELETE_CV: {
            let index = state.userProps.user.candidateCvs.findIndex(candidateCv => {
                return candidateCv.id === payload.cvId
            })
            state.userProps.user.candidateCvs.splice(index, 1)
            return {...state}
        }
        default:
            return state
    }
}