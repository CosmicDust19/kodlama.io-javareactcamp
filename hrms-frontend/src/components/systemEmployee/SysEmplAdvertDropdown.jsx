import {Dropdown, Icon} from "semantic-ui-react";
import {changePropInList, handleCatch} from "../../utilities/Utils";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {changeFilteredJobAdverts} from "../../store/actions/listingActions";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {useHistory} from "react-router-dom";

function SysEmplAdvertDropdown({jobAdvert, setJobAdvert, infoOption, ...props}) {

    const jobAdvertisementService = new JobAdvertisementService();

    const filteredJobAdverts = useSelector(state => state?.listingReducer.listingProps.jobAdverts.filteredJobAdverts)
    const userType = useSelector(state => state?.user?.userProps.userType)
    const dispatch = useDispatch();
    const history = useHistory();

    if (String(userType) !== "systemEmployee") return null

    const handleInfoClick = id => {
        history.push(`/jobAdverts/${id}`);
        window.scrollTo(0, 20)
    };

    const syncJobAdvert = (newJobAdvert, msg) => {
        const newFilteredJobAdverts = changePropInList(newJobAdvert.id, newJobAdvert, filteredJobAdverts)
        dispatch(changeFilteredJobAdverts(newFilteredJobAdverts))
        if (setJobAdvert) setJobAdvert(newJobAdvert)
        toast(msg)
    }

    const changeVerification = (jobAdvert, status) =>
        jobAdvertisementService.updateVerification(jobAdvert.id, status)
            .then(r => syncJobAdvert(r.data.data, status ? "Verified" : "Rejected"))
            .catch(handleCatch)

    const verifyUpdate = (jobAdvert) =>
        jobAdvertisementService.applyChanges(jobAdvert.id)
            .then(r => syncJobAdvert(r.data.data, "Update verified"))
            .catch(handleCatch)

    return (
        <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>} simple labeled direction={"left"} {...props}>
            <Dropdown.Menu style={{backgroundColor: "rgba(250,250,250, 0.8)", borderRadius: 0}}>
                {jobAdvert.updateVerified === false ?
                    <Dropdown.Item
                        onClick={() => verifyUpdate(jobAdvert)}>
                        <Icon name="redo alternate" color="orange"/>Verify Update
                    </Dropdown.Item> : null}
                {jobAdvert.verified === false ?
                    <Dropdown.Item
                        onClick={() => changeVerification(jobAdvert, true)}>
                        <Icon name="check circle outline" color="green"/>Verify
                    </Dropdown.Item> :
                    <Dropdown.Item
                        onClick={() => changeVerification(jobAdvert, false)}>
                        <Icon name="ban" color="red"/>Cancel Verification
                    </Dropdown.Item>}
                {jobAdvert.verified === false && jobAdvert.rejected === null ?
                    <Dropdown.Item
                        onClick={() => changeVerification(jobAdvert, false)}>
                        <Icon name="ban" color="red"/>Reject
                    </Dropdown.Item> : null}
                {infoOption === true ?
                    <Dropdown.Item
                        onClick={() => handleInfoClick(jobAdvert.id)}>
                        <Icon name="info" color="yellow"/>More Detail
                    </Dropdown.Item> :null}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default SysEmplAdvertDropdown;