import SInfoLabel from "./SInfoLabel";
import {Icon} from "semantic-ui-react";
import React from "react";
import {useSelector} from "react-redux";

function JobAdvertInfoLabels({jobAdvert, ...props}) {

    const userProps = useSelector(state => state?.user?.userProps)

    const publisherEmpl = jobAdvert.employer?.id === userProps.user?.id
    if (String(userProps.userType) !== "systemEmployee" && !publisherEmpl) return null

    return (
        <span {...props}>
            <SInfoLabel content={<div><Icon name="bullhorn" color="blue"/>Release</div>}
                        visible={jobAdvert.verified === false && jobAdvert.rejected === null} backgroundColor={"rgba(0,94,255,0.1)"}/>
            <SInfoLabel content={<div><Icon name="redo alternate" color="orange"/>Update</div>}
                        visible={jobAdvert.updateVerified === false} backgroundColor={"rgba(255,113,0,0.1)"}/>
            <SInfoLabel content={<div><Icon name="check circle outline" color="green"/>Verified</div>}
                        visible={jobAdvert.verified === true} backgroundColor={"rgba(58,255,0,0.1)"}/>
            <SInfoLabel content={<div><Icon name="ban" color="red"/>Rejected</div>}
                        visible={jobAdvert.rejected === true} backgroundColor={"rgba(226,14,14,0.1)"}/>
            <SInfoLabel content={<div><Icon name="checkmark" color="green"/>Active</div>}
                        visible={jobAdvert.active === true} backgroundColor={"rgba(57,255,0,0.1)"}/>
            <SInfoLabel content={<div><Icon name="minus circle" color="grey"/>Inactive</div>}
                        visible={jobAdvert.active === false} backgroundColor={"rgba(86,86,86,0.15)"}/>
            <SInfoLabel content={<div><Icon name="clock outline" color="red"/> Employer Unavailable</div>}
                        visible={(jobAdvert.employer?.rejected === true) ||
                        (jobAdvert.employer?.verified === false && jobAdvert.employer?.rejected === null)}
                        backgroundColor={"rgba(226,14,14,0.1)"}/>
        </span>
    )
}

export default JobAdvertInfoLabels;