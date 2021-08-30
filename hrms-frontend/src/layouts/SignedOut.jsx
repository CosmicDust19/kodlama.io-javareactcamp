import React from "react";
import {
    Button, Icon, Menu, Dropdown, Container, Grid,
} from "semantic-ui-react";
import {Link, useHistory} from "react-router-dom";

export default function SignedOut({toggle}) {

    const history = useHistory()

    const scroll = (y = 0) => window.scrollTo(0, y)

    return (
        <Container>

            <Grid columns={"equal"} padded>
                <Grid.Column>
                    <Menu.Item name="Jobs" as={Link} to={"/"} content={"Jobs"} />
                </Grid.Column>
                <Grid.Column>
                    <Menu.Item name="Users" as={Link} to={"/users"} color={"red"} content={"Users"} onClick={() => scroll(40)}/>
                </Grid.Column>
            </Grid>

            <Menu.Menu position='right'>
                <Menu.Item style={{marginRight: -40, marginLeft: -40}}>
                    <Button basic style={{opacity: 0.8, textAlign: "left"}} color={"yellow"} fluid
                            size={"large"} content={"Login"} icon={<Icon name='sign in alternate'/>} onClick={() => {
                        scroll()
                        history.push("/login")
                    }}/>
                </Menu.Item>
                <Menu.Item style={{marginRight: 20, marginLeft: 20}}>
                    <Dropdown text={"Sign Up As"} icon={<Icon name='signup' color={"purple"} style={{marginLeft: 10}}/>}
                              simple basic fluid button>
                        <Dropdown.Menu style={{marginRight: -2, backgroundColor: "rgba(240,242,255,0.6)"}}>
                            <Dropdown.Item as={Link} to={"/signup/candidate"} onClick={() => scroll(50)}
                                           content={"Candidate"}/>
                            <Dropdown.Item as={Link} to={"/signup/employer"} onClick={() => scroll(50)}
                                           content={"Employer"}/>
                            <Dropdown.Item as={Link} to={"/signup/systemEmployee"} onClick={() => scroll(50)}
                                           content={"System Employee"}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item style={{marginRight: -40, marginLeft: -40}}>
                    <Button size="small" onClick={toggle} basic fluid
                            icon={<Icon name='x' color={"black"} style={{marginRight: -4}}/>}/>
                </Menu.Item>
            </Menu.Menu>

        </Container>

    );
}
