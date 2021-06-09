import React from "react";
import { Container, Grid, Header, Icon, List, Segment, } from "semantic-ui-react";
export default function Footer() {
    return (
        <div className="footer">
            <Segment inverted vertical style={{ padding: "5em 0em" }}>
                <Container>
                    <Grid divided inverted stackable>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <List link inverted>
                                    <List.Item as="a">About us</List.Item>
                                    <List.Item as="a">Contact</List.Item>
                                    <List.Item as="a">Cookie</List.Item>
                                    <List.Item as="a">Privacy policy</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <div className="descriptionPosition">
                                    <Header as="h2">
                                        <Icon name="suitcase" color="orange" size = "big"/>
                                        <Header.Content>
                                            <font color="#f5f5f5">
                                                Human Resources Management System
                                            </font>
                                        </Header.Content>
                                    </Header>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
            <Segment>
                <Container>
                    © 2018 Human Resources Management System - All rights reserved.
                </Container>
            </Segment>

        </div>
    );
}