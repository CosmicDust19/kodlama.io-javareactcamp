import {handleCatch} from "./Utils";
import SystemEmployeeService from "../services/systemEmployeeService";
import {onUpdate} from "./UserUtils";

const sysEmplService = new SystemEmployeeService()

export const updateFirstName = (dispatch, sysEmpl, firstName) => {
    sysEmplService.updateFirstName(sysEmpl.id, firstName)
        .then(r => onUpdate(dispatch, r, "Saved"))
        .catch(handleCatch)
}

export const updateLastName = (dispatch, sysEmpl, lastName) => {
    sysEmplService.updateLastName(sysEmpl.id, lastName)
        .then(r => onUpdate(dispatch, r, "Saved"))
        .catch(handleCatch)
}