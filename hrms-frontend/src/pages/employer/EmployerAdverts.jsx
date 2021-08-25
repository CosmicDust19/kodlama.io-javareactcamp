import {useSelector} from "react-redux";
import React, {useState} from "react";
import {Grid, Header, Menu} from "semantic-ui-react";
import {EmplJobAdvManage} from "./EmplJobAdvManage";

export function EmployerAdverts() {

    const user = useSelector(state => state?.user?.userProps?.user)
    const userProps = useSelector(state => state?.user?.userProps)

    const [selectedJobAdv, setSelectedJobAdv] = useState(undefined);
    const [activeItem, setActiveItem] = useState(-1);
    const [refresh, setRefresh] = useState(true);

    const handleMenuItemClick = (activeItem) => {
        setActiveItem(activeItem)
        const index = user.jobAdvertisements.findIndex(jobAdv => jobAdv.id === activeItem)
        setSelectedJobAdv(user.jobAdvertisements[index]);
    }

    const refreshComponent = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    if (String(userProps.userType) !== "employer") return (<Header>Sorry You Do Not Have Access Here</Header>)

    let jobAdvInitialValues;
    if (!selectedJobAdv)
        jobAdvInitialValues = {
            employerId: userProps.user?.id, jobDescription: "", positionId: "", workTime: "",
            workModel: "", openPositions: "", cityId: "",
            minSalary: "", maxSalary: "", deadline: new Date().toISOString().split('T')[0],
        }
    else
        jobAdvInitialValues = {
            id: selectedJobAdv.id,
            employerId: userProps.user?.id, jobDescription: selectedJobAdv.jobDescription,
            positionId: selectedJobAdv.position.id, cityId: selectedJobAdv.city.id,
            workTime: selectedJobAdv.workTime, workModel: selectedJobAdv.workModel,
            openPositions: selectedJobAdv.openPositions, deadline: selectedJobAdv.deadline,
            minSalary: selectedJobAdv.minSalary === null ? "" : selectedJobAdv.minSalary,
            maxSalary: selectedJobAdv.maxSalary === null ? "" : selectedJobAdv.maxSalary,
        }

    return (
        <div>
            <strong style={{marginLeft: 35, color: "rgba(79,2,84,0.61)"}}>Manage Advertisements</strong>
            <Grid padded stackable centered>
                <Grid.Column width={5}>
                    <Menu fluid vertical tabular size={"small"}>
                        {user?.jobAdvertisements?.map((jobAdvertisement) => (
                            <Menu.Item
                                key={jobAdvertisement?.id}
                                content={`${jobAdvertisement?.position.title} | ${jobAdvertisement?.city.name}`}
                                name={String(jobAdvertisement?.id)} active={activeItem === jobAdvertisement?.id}
                                onClick={() => handleMenuItemClick(jobAdvertisement?.id)}
                            />
                        ))}
                        <Menu.Item
                            name={"Post New"} color={"green"} header icon={"plus"}
                            onClick={() => handleMenuItemClick(-1, undefined)}
                            active={activeItem === -1}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={11}>
                    {EmplJobAdvManage({jobAdvert: selectedJobAdv, refresh: refreshComponent})}
                </Grid.Column>
            </Grid>
        </div>
    )
}
