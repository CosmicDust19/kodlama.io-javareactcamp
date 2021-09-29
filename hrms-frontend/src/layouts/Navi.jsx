import React, {useEffect, useState} from "react";
import SignedIn from "./SignedIn"
import SignedOut from "./SignedOut"
import {useSelector} from "react-redux";
import {Icon, Menu, Sidebar, Transition} from "semantic-ui-react";

export default function Navi() {

    const userProps = useSelector(state => state?.user?.userProps)

    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight)
    const [authenticated, setAuthenticated] = useState(false)
    const [visible, setVisible] = useState(!verticalScreen)

    useEffect(() => {
        return () => {
            setVerticalScreen(undefined)
            setAuthenticated(undefined)
            setVisible(undefined)
        };
    }, []);


    useEffect(() => {
        setAuthenticated(userProps.loggedIn)
        setVerticalScreen(window.innerWidth < window.innerHeight)
    }, [userProps.loggedIn, visible]);

    const toggle = () => setVisible(!visible)

    return (
        <div>
            <Sidebar as={Menu} animation={"push"} direction={"top"} visible={visible} size="huge" secondary stackable
                     style={verticalScreen ? {backgroundColor: "rgba(250,250,250,0.95)"} :
                         {backgroundColor: "rgba(240,240,240,0.75)"}}>
                {authenticated ?
                    <SignedIn toggle={toggle} verticalScreen={verticalScreen}/> :
                    <SignedOut toggle={toggle}/>}
            </Sidebar>
            <Transition visible={!visible} duration={1000}>
                <div>
                    <Menu fixed={"top"} size={"mini"} style={{height: 1}} secondary>
                        <Menu.Item position={"right"} onClick={toggle} style={{marginTop: 0, marginBottom: -32, marginRight: 6}}>
                            <Icon name='bars' style={{marginRight: 10, marginLeft: 10, marginTop: 10, marginBottom: 10}} size={"large"} color={"black"}/>
                        </Menu.Item>
                    </Menu>
                </div>
            </Transition>
        </div>
    )

}
