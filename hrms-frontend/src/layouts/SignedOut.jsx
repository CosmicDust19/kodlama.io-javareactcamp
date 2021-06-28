import React from "react";
import {Button, ButtonGroup, Icon, Menu, Dropdown, Container} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default function SignedOut() {

    return (
        <Menu size="huge" fixed="top" secondary>
            <Container>

                <Menu.Item name="Main Page" as={Link} to={"/"}><Icon name="home" size="large"
                                                                     style={{margin: '5px'}}/></Menu.Item>
                <Menu.Item name="Find Jobs" as={Link} to={"/jobAdvertisements"}>Find Jobs</Menu.Item>
                <Menu.Item name="Users" as={Link} to={"/users"}>Users</Menu.Item>

                <Menu.Menu position='right'>
                    <Menu.Item>
                        <ButtonGroup>
                            <Button as={Link} to={"/candidateSignUp"} animated="fade" size={"big"} color={"purple"}>
                                <Button.Content visible>Sign Up</Button.Content>
                                <Button.Content hidden><Icon name='signup'/></Button.Content>
                            </Button>
                            <Button as={Link} to={"/login"} animated="fade" size={"big"} color={"yellow"}>
                                <Button.Content visible>Login</Button.Content>
                                <Button.Content hidden><Icon name='sign in alternate'/></Button.Content>
                            </Button>
                        </ButtonGroup>
                    </Menu.Item>
                    <Menu.Item>
                        <Dropdown item icon= "angle double down" button labeled>
                            <Dropdown.Menu position='right'>
                                <Dropdown.Header>Employers</Dropdown.Header>
                                <Dropdown.Item as={Link} to={"/login"}>Login</Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/employerSignUp"}>Sign Up</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Header>System Employees</Dropdown.Header>
                                <Dropdown.Item as={Link} to={"/login"}>Login</Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/systemEmployeeSignUp"}>Sign Up</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu.Menu>

            </Container>
        </Menu>



    );
}