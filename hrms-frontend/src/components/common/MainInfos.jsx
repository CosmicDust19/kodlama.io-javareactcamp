import {Divider, Grid, Header, Icon, Item, Loader} from "semantic-ui-react";
import React from "react";
import EmployerInfoLabels from "../employer/EmployerInfoLabels";
import ImageUploadModal from "./ImageUploadModal";
import Avatar from "./Avatar";
import {getAge} from "../../utilities/UserUtils";
import EmployerLogo from "../employer/EmployerLogo";

function MainInfos({user, width = 8, simple = false}) {

    if (!user) return <Loader active inline='centered' size={"large"}/>

    return (
        <Grid stackable>
            <Grid.Column width={width}>

                <EmployerInfoLabels employer={user} style={{float: "right"}}/><br/>
                <Item.Group>
                    <Item>
                        <Item.Image style={{textAlign: "center"}}>
                            {user.companyName && !user.profileImg ?
                                <EmployerLogo user={user} size={"big"} style={{}}/> :
                                <Avatar image={user.profileImg} size={"big"}/>}
                            {!simple ? <ImageUploadModal user={user}/> : null}
                        </Item.Image>
                        <Item.Content verticalAlign={"middle"}>

                            {user.firstName && user.lastName ?
                                <Item.Header as='a'>
                                    <Header>
                                        {user.firstName}
                                        <Header.Subheader content={user.lastName}/>
                                    </Header>
                                </Item.Header> : null}

                            {user.companyName ? <Item.Header as='a' content={<Header content={user.companyName}/>}/> : null}

                            <Divider fitted style={{marginTop: 5}}/>

                            {user.birthYear ?
                                <Item.Meta>
                                    <Icon name={"calendar alternate outline"} color={"purple"}/>&nbsp;&nbsp;
                                    {getAge(user.birthYear)} years old
                                </Item.Meta> : null}

                            {user.email ?
                                <Item.Description>
                                    <Icon name={"mail outline"} color={"red"}/>&nbsp;{user.email}
                                </Item.Description> : null}

                            {user.phoneNumber ? <Item.Meta><Icon name={"phone"} color={"yellow"}/> {user.phoneNumber}</Item.Meta> : null}

                            {user.website ?
                                <Item.Description><Icon name={"world"} color={"blue"}/> {user.website}</Item.Description> : null}

                            {user.linkedinAccount || user.githubAccount ?
                                <Item.Extra>
                                    {user.githubAccount ?
                                        <a href={user.githubAccount}><Icon name={"github"} size="big" color={"black"}/></a> : null}
                                    {user.linkedinAccount ?
                                        <a href={user.linkedinAccount}><Icon name={"linkedin"} size="big"/></a> : null}
                                </Item.Extra> : null}

                        </Item.Content>
                    </Item>
                </Item.Group>
            </Grid.Column>
        </Grid>
    )
}

export default MainInfos;