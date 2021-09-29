import React from "react";
import {Button, Container, Dropdown, Grid, Icon, Menu,} from "semantic-ui-react";
import {Link, useHistory} from "react-router-dom";

export default function SignedOut({toggle}) {

    const history = useHistory()

    const scroll = (y = 0) => window.scrollTo(0, y)

    const handleLoginClick = () => {
        scroll()
        history.push("/login")
    }

    return (
        <Container>

            <Grid columns={"equal"} padded>
                <Grid.Column>
                    <Menu.Item name="Jobs" as={Link} to={"/"} content={"Jobs"}/>
                </Grid.Column>
                <Grid.Column>
                    <Menu.Item name="Users" as={Link} to={"/users"} color={"red"} content={"Users"} onClick={() => scroll(10)}/>
                </Grid.Column>
            </Grid>

            <Menu.Menu position='right'>
                <Menu.Item style={{marginRight: -50, marginLeft: -50}}>
                    <Button basic style={{opacity: 0.8, textAlign: "left"}} color={"yellow"} fluid
                            size={"large"} content={"Login"} icon={<Icon name='sign in alternate'/>} onClick={handleLoginClick}/>
                </Menu.Item>
                <Menu.Item style={{marginRight: 30, marginLeft: 30}}>
                    <Dropdown text={"Sign Up As"} icon={<Icon name='signup' color={"purple"} style={{marginLeft: 10, borderRadius: 0}}/>}
                              simple basic fluid button closeOnEscape closeOnBlur closeOnChange>
                        <Dropdown.Menu style={{backgroundColor: "rgba(240,240,240,0.9)", width: 167, borderRadius: 0}}>
                            <Dropdown.Item as={Link} to={"/signup/candidate"} onClick={() => scroll(50)} content={"Candidate"}/>
                            <Dropdown.Item as={Link} to={"/signup/employer"} onClick={() => scroll(50)} content={"Employer"}/>
                            <Dropdown.Item as={Link} to={"/signup/systemEmployee"} onClick={() => scroll(50)} content={"System Employee"}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item style={{marginRight: -50, marginLeft: -50, maxWidth: 75}}>
                    <Button size="small" onClick={toggle} fluid circular icon={<Icon name='x' color={"purple"}/>}
                    inverted color={"yellow"}/>
                </Menu.Item>
            </Menu.Menu>

        </Container>

    );
}
