import React from "react";
import {Button, Menu} from "semantic-ui-react";
import {Container} from "semantic-ui-react";
import {Icon} from "semantic-ui-react";
import {Header} from "semantic-ui-react";

const NaviMainMenu = () => (
    <div>
        <Button animated color={"orange"}>
            <Button.Content visible>Home</Button.Content>
            <Button.Content hidden><Icon name='arrow right'/></Button.Content>
        </Button>
        <Button animated='fade' color={"orange"}>
            <Button.Content visible>Help</Button.Content>
            <Button.Content hidden><Icon name= 'question'/></Button.Content>
        </Button>
        <Button animated='vertical' color={"orange"}>
            <Button.Content hidden><Icon name='find' /></Button.Content>
            <Button.Content visible>
                Job Advertisements
            </Button.Content>
        </Button>
    </div>
)

export default function Navi() {
    return (
        <div>
            <Menu inverted fixed="top">
                <Container>
                    <div className="logo">
                        <Header as="h2">
                            <Icon
                                inverted
                                color="orange"
                                name="gg"
                                size="small"
                            />
                        </Header>
                    </div>
                    <div className="MainMenu">
                        <Menu.Menu position="left">
                            <Menu.Item>
                                <NaviMainMenu/>
                            </Menu.Item>
                        </Menu.Menu>
                    </div>
                    <div className="searchBar">
                        <div className="ui grid">
                            <div className="six wide column">
                                <div className="ui search">
                                    <div className="ui icon input"><input type="text" autoComplete="off" value=""
                                                                          tabIndex="0" className="prompt"/><i
                                        aria-hidden="true" className="search icon" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Menu>
        </div>
    );
}