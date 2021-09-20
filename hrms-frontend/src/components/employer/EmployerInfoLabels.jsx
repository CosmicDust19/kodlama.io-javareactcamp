import SInfoLabel from "../common/SInfoLabel";
import {Icon} from "semantic-ui-react";
import React from "react";
import {useSelector} from "react-redux";

function EmployerInfoLabels({employer, ...props}) {

    const userProps = useSelector(state => state?.user?.userProps)
    if (String(userProps.userType) !== "systemEmployee" && userProps.user?.id !== employer.id) return null

    return (
        <span {...props}>
            <SInfoLabel content={<div><Icon name="user plus" color="blue"/>Sign Up</div>}
                        visible={employer.verified === false && employer.rejected === null} backgroundColor={"rgba(0,94,255,0.1)"}/>
            <SInfoLabel content={<div><Icon name="redo alternate" color="orange"/>Update</div>}
                        visible={employer.updateVerified === false} backgroundColor={"rgba(255,113,0,0.1)"}/>
            <SInfoLabel content={<div><Icon name="check circle outline" color="green"/>Verified</div>}
                        visible={employer.verified === true} backgroundColor={"rgba(58,255,0,0.1)"}/>
            <SInfoLabel content={<div><Icon name="ban" color="red"/>Rejected</div>}
                        visible={employer.rejected === true} backgroundColor={"rgba(226,14,14,0.1)"}/>
        </span>
    )

}

export default EmployerInfoLabels;