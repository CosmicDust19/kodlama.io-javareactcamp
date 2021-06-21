import {Dropdown, Icon, Image, Menu} from "semantic-ui-react";
import React from "react";

export default function SignedIn({signOut, isEmployer}) {
    return (
        <Menu.Menu  position='right'>
            <Menu.Item>
                <Image size = "mini" src = 'https://user-images.githubusercontent.com/74824916/122045900-edc1b800-cde6-11eb-8d51-e44fe3c3daba.png'/>
                <Dropdown item text='User Name'>
                    <Dropdown.Menu>
                        <Dropdown.Item><Icon name = "info"/>Account</Dropdown.Item>
                        <Dropdown.Item><Icon name = "settings"/>Settings</Dropdown.Item>
                        <Dropdown.Item onClick = {() => {signOut();isEmployer(false);}}><Icon name = "sign out"/>Sign Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        </Menu.Menu>
    );
}