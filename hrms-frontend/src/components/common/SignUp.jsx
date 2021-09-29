import {Link} from "react-router-dom";
import {Button, Form, Grid, Header, Icon, Message, Segment, Transition} from "semantic-ui-react";
import {useEffect, useState} from "react";

export function SignUp({formik, inputComponents, toggleJiggle, loading}) {

    const [visible, setVisible] = useState(false);
    const [loginMsgOpen, setLoginMsgOpen] = useState(true);

    useEffect(() => {
        setVisible(true)
        return () => {
            setVisible(undefined)
            setLoginMsgOpen(undefined)
        };
    }, []);

    return (
        <Transition visible={visible} duration={200}>
            <div>
                <Header color="purple" textAlign="center" content={"Sign Up"}/>

                <Grid centered stackable padded>
                    <Grid.Column width={6}>
                        <Segment placeholder color={"purple"} padded textAlign={"center"} raised
                                 style={{borderRadius: 15, opacity: 0.85, backgroundColor: "rgb(255,255,255, 0.6)"}}>
                            <Form size="large" onSubmit={formik.handleSubmit}>
                                {inputComponents}
                                <Button animated="fade" type="submit" size="large" color="purple"
                                        style={{marginTop: 15, borderRadius: 7}}
                                        onClick={toggleJiggle} loading={loading}>
                                    <Button.Content hidden><Icon name='signup'/></Button.Content>
                                    <Button.Content visible>Sign Up</Button.Content>
                                </Button>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid>

                <Grid textAlign="center" stackable>
                    <Grid.Column width={10}>
                        <Transition visible={loginMsgOpen} duration={200}>
                            <Message warning onDismiss={() => setLoginMsgOpen(false)}
                                     style={{backgroundColor: "rgba(253,241,227,0.3)", borderRadius: 9}}>
                                <Icon name='help'/>
                                Already signed up ?
                                <Link to={"/login"} onClick={() => window.scrollTo(0, 0)}> Login Here </Link>
                                instead.
                            </Message>
                        </Transition>
                    </Grid.Column>
                </Grid>

            </div>
        </Transition>
    );
}
