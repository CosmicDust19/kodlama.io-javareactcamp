import {Dropdown, Icon} from "semantic-ui-react";
import {changePropInList, handleCatch} from "../../utilities/Utils";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {changeEmplJobAdverts} from "../../store/actions/userActions";
import {useHistory} from "react-router-dom";
import AreYouSureModal from "../common/AreYouSureModal";

function EmplAdvertDropdown({jobAdvert, setJobAdvert, infoOption}) {

    const jobAdvertService = new JobAdvertisementService();

    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.userProps?.user)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        return () => setDeleteModalOpen(undefined)
    }, []);

    if (jobAdvert.employer?.id !== user?.id) return null

    const handleDetailClick = (jobAdvertId) => {
        history.push(`/jobAdverts/${jobAdvertId}`);
        window.scrollTo(0, 0);
    }

    const syncJobAdvert = (newJobAdvert, msg) => {
        const jobAdverts = changePropInList(jobAdvert.id, newJobAdvert, user.jobAdvertisements)
        dispatch(changeEmplJobAdverts(jobAdverts))
        if (setJobAdvert) setJobAdvert(newJobAdvert)
        toast(msg)
    }

    const changeActivation = (status) => {
        jobAdvertService.updateActivation(jobAdvert.id, status)
            .then(r => syncJobAdvert(r.data.data, status === true ? "Activated" : "Deactivated"))
            .catch(handleCatch)
    }

    const deleteJobAdvert = () => {
        jobAdvertService.deleteById(jobAdvert.id)
            .then(() => {
                const index = user.jobAdvertisements.findIndex(userAdvert => userAdvert.id === jobAdvert.id)
                user.jobAdvertisements.splice(index, 1)
                dispatch(changeEmplJobAdverts(user.jobAdvertisements))
                if (setJobAdvert) setJobAdvert(null)
                toast("Deleted")
            })
            .catch(handleCatch)
    }

    return (
        <span>
            <AreYouSureModal open={deleteModalOpen} message={"Are you sure you want to delete permanently ?"}
                             yesColor={"red"} noColor={"grey"} onYes={deleteJobAdvert} onNo={() => setDeleteModalOpen(false)}/>
            <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>} simple labeled direction={"left"}>
                <Dropdown.Menu style={{marginTop: 0, marginLeft: -6, backgroundColor: "rgba(250,250,250, 0.7)", borderRadius: 5}}>
                    {jobAdvert.active === false ?
                        <Dropdown.Item
                            onClick={() => changeActivation(true)}>
                            <Icon name="check" color="green"/>Activate
                        </Dropdown.Item> :
                        <Dropdown.Item
                            onClick={() => changeActivation(false)}>
                            <Icon name="minus circle" color="grey"/>Deactivate
                        </Dropdown.Item>}
                    <Dropdown.Item
                        onClick={() => setDeleteModalOpen(true)}>
                            <Icon name="x" color="red"/>Delete
                    </Dropdown.Item>
                    {infoOption === true ?
                        <Dropdown.Item
                            onClick={() => handleDetailClick(jobAdvert.id)}>
                            <Icon name="info" color="yellow"/>More Detail
                        </Dropdown.Item> : null}
                </Dropdown.Menu>
            </Dropdown>
        </span>
    )
}

export default EmplAdvertDropdown;