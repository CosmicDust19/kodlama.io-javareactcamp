import {Segment, Grid, Form, Button, Icon, Header, Message, Transition} from "semantic-ui-react";
import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../../store/actions/userActions";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import UserService from "../../services/userService";
import SPopupInput from "../../utilities/customFormControls/SPopupInput";
import React, {useEffect, useState} from "react";
import {handleCatch} from "../../utilities/Utils";
import * as Yup from "yup";

export default function Login() {

    const userService = new UserService();

    const dispatch = useDispatch();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [jiggle, setJiggle] = useState(true);
    const [visible, setVisible] = useState(false);
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight);
    const [signUpMsgOpen, setSignUpMsgOpen] = useState(true);

    useEffect(() => {
        setVisible(true)
        return () => {
            setLoading(undefined)
            setJiggle(undefined)
            setVisible(undefined)
            setVerticalScreen(undefined)
            setSignUpMsgOpen(undefined)
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            email: "", password: ""
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().required("Required"),
            password: Yup.string().required("Required")
        }),
        onSubmit: (values) => {
            setLoading(true)
            userService.login(values.email, values.password)
                .then(result => {
                    dispatch(login(result.data.data, result.data.message.substr(0, result.data.message.indexOf(" "))))
                    history.push("/")
                    toast("Welcome", {autoClose: 1500})
                }).catch(handleCatch).finally(() => setLoading(false))
        }
    });

    const popupPosition = verticalScreen ? "top center" : "right center"
    const popupSize = !verticalScreen ? undefined : "small"

    return (
        <Transition visible={visible} duration={200}>
            <div>
                <Header color="yellow" textAlign="center" content={"Login"}/>
                <Grid centered stackable padded>
                    <Grid.Column mobile={6}>
                        <Segment placeholder color={"yellow"} padded textAlign={"center"} raised
                                 style={{borderRadius: 14, opacity: 0.85, backgroundColor: "rgb(250,250,250, 0.7)"}}>
                            <Form size="large" onSubmit={formik.handleSubmit}>
                                <Grid padded>
                                    <Grid.Column>
                                        <SPopupInput icon="at" iconposition={"left"} placeholder="Email" name="email"
                                                     formik={formik} popupposition={popupPosition} popupsize={popupSize}
                                                     jiggle={jiggle} className={"padded"}/>
                                        <SPopupInput icon="lock" iconposition={"left"} placeholder="Password" name="password"
                                                     type={"password"} formik={formik} popupposition={popupPosition} popupsize={popupSize}
                                                     jiggle={jiggle} className={"padded"}/>
                                    </Grid.Column>
                                </Grid>
                                <Button animated="fade" type="submit" size="big" color="yellow" loading={loading}
                                        style={{borderRadius: 7}} onClick={() => setJiggle(!jiggle)}>
                                    <Button.Content hidden><Icon name='sign in alternate'/></Button.Content>
                                    <Button.Content visible>Login</Button.Content>
                                </Button>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid>
                <Grid textAlign="center" stackable>
                    <Grid.Column width={9}>
                        <Transition visible={signUpMsgOpen} duration={200}>
                            <Message warning onDismiss={() => setSignUpMsgOpen(false)}
                                     style={{backgroundColor: "rgba(253,241,227,0.3)", borderRadius: 9}}>
                                <Icon name='help'/>
                                Didn't you signed up yet ? Sign up as a
                                <Link to={"/signup/candidate"} onClick={() => window.scrollTo(0, 100)}> candidate </Link>
                                or an
                                <Link to={"/signup/employer"} onClick={() => window.scrollTo(0, 50)}> employer</Link>.
                            </Message>
                        </Transition>
                    </Grid.Column>
                </Grid>
            </div>
        </Transition>
    )
}