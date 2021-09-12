import {Button, Header, Icon, Modal} from "semantic-ui-react";
import React from "react";

function AreYouSureModal({message, onYes, onNo, yesColor = "yellow", noColor= "red", ...props}) {
    return (
        <Modal basic size='small' onClose={onNo} closeOnDimmerClick {...props}>
            <Header size={"large"} color={"yellow"} content={message}/>
            <Modal.Actions>
                <Button color={yesColor} inverted size='large' onClick={onYes} floated={"left"}>
                    <Icon name='checkmark'/> Yes
                </Button>
                <Button basic color={noColor} inverted size='large' floated={"left"} onClick={onNo}>
                    <Icon name='remove'/> No
                </Button>
            </Modal.Actions>
        </Modal>)
}

export default AreYouSureModal;