import React from "react";
import {Divider, Segment, Grid, Form, Button} from "semantic-ui-react";

export default function Login({login, isEmployer}) {
    return (
        <div className="ui segment active tab">
            <Divider horizontal> </Divider>
            <Segment placeholder>
                <Grid columns={2} relaxed='very' stackable>
                    <Grid.Column>
                        <Form>
                            <Form.Input
                                icon='mail'
                                iconPosition='left'
                                placeholder='Email'
                            />
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                type='password'
                                placeholder='Password'
                            />
                            <Button onClick = {() => {login();isEmployer(true);}} content='Login' primary/>
                        </Form>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle'>
                        <Button content='Sign up' icon='signup' size='big'/>
                    </Grid.Column>
                </Grid>
                <Divider vertical>Or</Divider>
            </Segment>
        </div>
    )
}