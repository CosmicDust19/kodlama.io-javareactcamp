import React from "react";
import {Button, ButtonGroup, Icon, Menu, Dropdown, Container} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default function SignedOut() {

    const handleScrollToTop = () => window.scrollTo(0, 0)

    return (
        <Menu size="huge" fixed="top" secondary>
            <Container>

                <Menu.Item name="Jobs" as={Link} to={"/"}>Jobs</Menu.Item>
                <Menu.Item name="Users" as={Link} to={"/users"} onClick={() => {
                    window.scrollTo(0, 40)
                }}>Users</Menu.Item>

                <Menu.Menu position='right'>
                    <Menu.Item>
                        <ButtonGroup>
                            <Button as={Link} to={"/signUpCandidate"} animated="fade" size={"large"} color={"purple"}
                                    style={{opacity: 1}}
                                    basic active onClick={() => {
                                        window.scrollTo(0, 100)
                                    }}>
                                <Button.Content visible>Sign Up</Button.Content>
                                <Button.Content hidden><Icon name='signup'/></Button.Content>
                            </Button>
                            <Button as={Link} to={"/login"} animated="fade" size={"large"} color={"yellow"}
                                    onClick={handleScrollToTop} style={{opacity: 0.9}}>
                                <Button.Content visible>Login</Button.Content>
                                <Button.Content hidden><Icon name='sign in alternate'/></Button.Content>
                            </Button>
                        </ButtonGroup>
                    </Menu.Item>
                    <Menu.Item>
                        <Dropdown icon="ellipsis horizontal" simple>
                            <Dropdown.Menu position='right' style={{marginRight: -70, backgroundColor: "rgba(250,250,250, 0.5)", borderRadius: 10}}>
                                <Dropdown.Header>Employers</Dropdown.Header>
                                <Dropdown.Item as={Link} to={"/login"} onClick={handleScrollToTop}>Login</Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/signUpEmployer"} onClick={() => {
                                    window.scrollTo(0, 70)
                                }}>
                                    Sign Up</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Header>System Employees</Dropdown.Header>
                                <Dropdown.Item as={Link} to={"/login"} onClick={handleScrollToTop}>Login</Dropdown.Item>
                                <Dropdown.Item as={Link} to={"/signUpSystemEmployee"} onClick={() => {
                                    window.scrollTo(0, 60)
                                }}>
                                    Sign Up</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu.Menu>

            </Container>
        </Menu>


    );
}