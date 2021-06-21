import React from "react";
import {Button, ButtonGroup, Dropdown, Icon, Menu} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default function SignedOut({login, isEmployer}) {
    return (
        <Menu.Menu position='right'>
            <Menu.Item>
                <ButtonGroup>
                    <Button as={Link} to={"/signUp"} animated="fade" size={"big"} color={"purple"}>
                        <Button.Content visible>Sign Up</Button.Content>
                        <Button.Content hidden><Icon name='signup'/></Button.Content>
                    </Button>
                    <Button onClick = {() => {login();isEmployer(false);}} animated="fade" size={"big"} color={"yellow"}>
                        <Button.Content visible>Login</Button.Content>
                        <Button.Content hidden><Icon name='sign in alternate'/></Button.Content>
                    </Button>
                </ButtonGroup>
            </Menu.Item>
            <Menu.Item>
                <Dropdown item text='Employers'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick = {() => {login();isEmployer(true);}}>Login</Dropdown.Item>
                        <Dropdown.Item>Sign Up</Dropdown.Item>
                        <Dropdown.Item>Free Trial</Dropdown.Item>
                        <Dropdown.Item as={Link} to={"/postJobAdvertisement"}>Post Job</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        </Menu.Menu>
    );
}