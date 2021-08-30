import React, {useEffect, useState} from "react";
import SignedIn from "./SignedIn"
import SignedOut from "./SignedOut"
import {useSelector} from "react-redux";
import {Icon, Menu, Sidebar} from "semantic-ui-react";

export default function Navi() {

    const userProps = useSelector(state => state?.user?.userProps)

    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight)
    const [authenticated, setAuthenticated] = useState(false)
    const [visible, setVisible] = useState(!verticalScreen)

    useEffect(() => {
        setAuthenticated(userProps.loggedIn)
        setVerticalScreen(window.innerWidth < window.innerHeight)
    }, [userProps.loggedIn, visible]);

    const toggle = () => setVisible(!visible)

    return (
        <div>
            <Sidebar as={Menu} animation={"push"} direction={"top"} visible={visible} size="huge" secondary stackable
                     style={verticalScreen ? {backgroundColor: "rgba(250,250,250,0.8)"} :
                         {backgroundColor: "rgba(236,236,236,0.3)"}}>
                {authenticated ?
                    <SignedIn toggle={toggle} verticalScreen={verticalScreen}/> :
                    <SignedOut toggle={toggle}/>}
            </Sidebar>
            {!visible ?
                <Menu fixed={"top"} size={"mini"} style={{height: 1}} secondary>
                    <Menu.Item position={"right"} onClick={toggle} style={{marginTop: 0, marginBottom: -35, marginRight: 6}}>
                        <Icon name='bars' style={{marginRight: 10, marginLeft: 10, marginTop: 10, marginBottom: 10}} size={"large"} color={"black"}/>
                    </Menu.Item>
                </Menu> : null}
        </div>
    )

}
