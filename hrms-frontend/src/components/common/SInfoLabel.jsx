import React from 'react';
import {Label} from "semantic-ui-react";

function SInfoLabel({visible, backgroundColor, content, ...props}) {
    return (
        visible ?
            <Label style={{marginTop: 5, marginBottom: 5, backgroundColor: backgroundColor}} {...props}>
                {content}
            </Label> : null
    );
}

export default SInfoLabel;