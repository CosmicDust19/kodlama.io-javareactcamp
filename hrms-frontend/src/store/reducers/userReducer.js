import {userProps} from "../initialStates/userProps";
import {
    LOGIN, SIGN_OUT, CHANGE_EMAIl,

    CHANGE_GITHUB, CHANGE_LINKEDIN,
    CHANGE_JOBEXP, CHANGE_LANG, CHANGE_SCHOOL, CHANGE_SKILL,
    CHANGE_FAVORITE_JOB_ADVS,
    CHANGE_CV_TITLE, CHANGE_CV_COVERLETTER,
    CHANGE_CV_JOBEXP, CHANGE_CV_LANG, CHANGE_CV_SCHOOL, CHANGE_CV_SKILL,
    ADD_CV, DELETE_CV,

    CHANGE_FIRSTNAME, CHANGE_LASTNAME,

    CHANGE_COMP_NAME, CHANGE_WEBSITE, CHANGE_PHONE, CHANGE_EMPLOYER_UPDATE
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
            state.userProps.guest = false
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
            state.userProps.user.githubAccount = payload.link
            return {...state}
        case CHANGE_LINKEDIN:
            state.userProps.user.linkedinAccount = payload.link
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
            let index = state.userProps.user.cvs.findIndex(cv => {
                return cv.id === payload.cvId
            })
            state.userProps.user.cvs[index].title = payload.title
            return {...state}
        }
        case CHANGE_CV_COVERLETTER: {
            let index = state.userProps.user.cvs.findIndex(cv => {
                return cv.id === payload.cvId
            })
            state.userProps.user.cvs[index].coverLetter = payload.coverLetter
            return {...state}
        }
        case CHANGE_CV_JOBEXP: {
            let index = state.userProps.user.cvs.findIndex(cv => {
                return cv.id === payload.cvId
            })
            state.userProps.user.cvs[index].candidateJobExperiences = payload.jobExps
            return {...state}
        }
        case CHANGE_CV_LANG: {
            let index = state.userProps.user.cvs.findIndex(cv => {
                return cv.id === payload.cvId
            })
            state.userProps.user.cvs[index].candidateLanguages = payload.cvLangs
            return {...state}
        }
        case CHANGE_CV_SCHOOL: {
            let index = state.userProps.user.cvs.findIndex(cv => {
                return cv.id === payload.cvId
            })
            state.userProps.user.cvs[index].candidateSchools = payload.cvSchools
            return {...state}
        }
        case CHANGE_CV_SKILL: {
            let index = state.userProps.user.cvs.findIndex(cv => {
                return cv.id === payload.cvId
            })
            state.userProps.user.cvs[index].candidateSkills = payload.cvSkills
            return {...state}
        }
        case ADD_CV: {
            state.userProps.user.cvs.push(payload.CV)
            return {...state}
        }
        case DELETE_CV: {
            let index = state.userProps.user.cvs.findIndex(cv => {
                return cv.id === payload.cvId
            })
            state.userProps.user.cvs.splice(index, 1)
            return {...state}
        }
        case CHANGE_EMPLOYER_UPDATE:
            state.userProps.user.employerUpdate = payload.employerUpdate
            state.userProps.user.updateVerified = false
            return {...state}
        case CHANGE_WEBSITE:
            state.userProps.user.website = payload.website
            return {...state}
        case CHANGE_COMP_NAME:
            state.userProps.user.companyName = payload.companyName
            return {...state}
        case CHANGE_PHONE:
            state.userProps.user.phone = payload.phone
            return {...state}
        default:
            return state
    }
}