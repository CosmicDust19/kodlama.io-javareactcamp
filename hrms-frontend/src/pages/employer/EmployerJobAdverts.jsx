import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Grid, Header, Menu, Transition} from "semantic-ui-react";
import {EmplJobAdvertSeg} from "../../components/employer/EmplJobAdvertSeg";
import {getJobAdvertColor} from "../../utilities/JobAdvertUtils";

export function EmployerJobAdverts() {

    const userProps = useSelector(state => state?.user?.userProps)
    const user = userProps.user

    const [visible, setVisible] = useState(false);
    const [jobAdverts, setJobAdverts] = useState(user.jobAdvertisements);
    const [selectedJobAdv, setSelectedJobAdv] = useState();
    const [activeItem, setActiveItem] = useState(-1);

    useEffect(() => {
        setVisible(true)
        return () => {
            setJobAdverts(undefined)
            setSelectedJobAdv(undefined)
            setActiveItem(undefined)
        };
    }, []);

    useEffect(() => {
        setJobAdverts(user.jobAdvertisements)
    }, [user.jobAdvertisements]);

    if (String(userProps.userType) !== "employer") return <Header content={"😛🤪🤭"}/>

    const handleMenuItemClick = (activeItem) => {
        setActiveItem(activeItem)
        const index = jobAdverts.findIndex(jobAdv => jobAdv.id === activeItem)
        setSelectedJobAdv(jobAdverts[index]);
    }

    return (
        <Transition visible={visible} duration={200}>
            <div>
                <strong style={{marginLeft: 35, color: "rgba(79,2,84,0.61)"}}>Manage Advertisements</strong>
                <Grid padded stackable centered>
                    <Grid.Column width={5}>
                        <Menu fluid vertical tabular pointing secondary size={"small"}>
                            {jobAdverts?.map((jobAdvert) => (
                                <Menu.Item key={jobAdvert?.id} color={getJobAdvertColor(jobAdvert, true)}
                                           content={`${jobAdvert?.position.title} | ${jobAdvert?.city.name}`}
                                           name={String(jobAdvert?.id)} active={activeItem === jobAdvert?.id}
                                           onClick={() => handleMenuItemClick(jobAdvert?.id)}/>
                            ))}
                            <Menu.Item name={"-1"} content={"Post New"} color={"blue"} header icon={"plus"}
                                       active={activeItem === -1} onClick={() => handleMenuItemClick(-1)}/>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column stretched width={11}>
                        <EmplJobAdvertSeg jobAdvert={selectedJobAdv}/>
                    </Grid.Column>
                </Grid>
            </div>
        </Transition>
    )
}
