import React from 'react';
import {Label} from "semantic-ui-react";

function SInfoLabel({visible, backgroundColor, content}) {
    return (
        visible ?
            <Label style={{marginTop: 5, marginBottom: 5, backgroundColor: backgroundColor}}>
                {content}
            </Label> : null
    );
}

export default SInfoLabel;