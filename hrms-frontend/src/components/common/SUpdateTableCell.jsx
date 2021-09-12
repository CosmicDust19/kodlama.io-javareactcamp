import React from 'react';
import {Icon, Table} from "semantic-ui-react";

function SUpdateTableCell({infoAuthorized, visible, emptyCell, content, ...props}) {
    return (
        infoAuthorized ? (visible ?
           <Table.Cell {...props} warning collapsing>
               <Icon name="redo alternate" color="orange"/>&nbsp;{content}
           </Table.Cell> : (emptyCell ? <Table.Cell/> : null)) : null
    );
}

export default SUpdateTableCell;