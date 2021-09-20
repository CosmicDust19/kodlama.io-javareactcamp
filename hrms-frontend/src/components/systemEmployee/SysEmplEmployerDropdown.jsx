import {Dropdown, Icon} from "semantic-ui-react";
import {changePropInList, handleCatch} from "../../utilities/Utils";
import {changeFilteredEmployers} from "../../store/actions/listingActions";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {useHistory} from "react-router-dom";
import EmployerService from "../../services/employerService";

function SysEmplEmployerDropdown({employer, setEmployer, infoOption, ...props}) {

    const employerService = new EmployerService();

    const filteredEmployers = useSelector(state => state?.listingReducer.listingProps.employers.filteredEmployers)
    const userType = useSelector(state => state?.user?.userProps.userType)
    const dispatch = useDispatch();
    const history = useHistory();

    if (String(userType) !== "systemEmployee") return null

    const handleEmployerInfoClick = id => {
        history.push(`/employers/${id}`);
        window.scrollTo(0, 0)
    }

    const syncEmployer = (newEmployer, msg) => {
        const newFilteredEmployers = changePropInList(newEmployer.id, newEmployer, filteredEmployers)
        dispatch(changeFilteredEmployers(newFilteredEmployers))
        if (setEmployer) setEmployer(newEmployer)
        toast(msg)
    }

    const changeVerification = (employer, status) => {
        employerService.updateVerification(employer.id, status)
            .then(r => syncEmployer(r.data.data, "Verified"))
            .catch(handleCatch)
    }

    const verifyUpdate = (employer) => {
        employerService.applyChanges(employer.id)
            .then(r => syncEmployer(r.data.data, "Verified"))
            .catch(handleCatch)
    }

    return (
        <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>} direction={"left"} simple labeled {...props}>
            <Dropdown.Menu style={{backgroundColor: "rgba(250,250,250, 0.8)", borderRadius: 0}}>
                {employer.updateVerified === false ?
                    <Dropdown.Item
                        onClick={() => verifyUpdate(employer)}>
                        <Icon name="redo alternate" color="orange"/>Verify Update
                    </Dropdown.Item> : null}
                {employer.verified === false ?
                    <Dropdown.Item
                        onClick={() => changeVerification(employer, true)}>
                        <Icon name="check circle outline" color="green"/>Verify
                    </Dropdown.Item> :
                    <Dropdown.Item
                        onClick={() => changeVerification(employer, false)}>
                        <Icon name="ban" color="red"/>Cancel Verification
                    </Dropdown.Item>}
                {employer.verified === false && employer.rejected === null ?
                    <Dropdown.Item
                        onClick={() => changeVerification(employer, false)}>
                        <Icon name="ban" color="red"/>Reject
                    </Dropdown.Item> : null}
                {infoOption === true ?
                    <Dropdown.Item
                        onClick={() => handleEmployerInfoClick(employer.id)}>
                        <Icon name="info" color="yellow"/>More Detail
                    </Dropdown.Item> : null}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default SysEmplEmployerDropdown;