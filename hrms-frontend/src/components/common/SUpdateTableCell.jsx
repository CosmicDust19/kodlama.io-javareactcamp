import React from 'react';
import {Icon, Table} from "semantic-ui-react";

function SUpdateTableCell({infoAuthorized, visible, emptyCell, content, ...props}) {
    return (
        infoAuthorized ? (visible ?
           <Table.Cell {...props} collapsing style={{backgroundColor: "rgba(255,200,150,0.16)"}}>
               <Icon name="redo alternate" color="orange"/>&nbsp;{content}
           </Table.Cell> : (emptyCell ? <Table.Cell/> : null)) : null
    );
}

export default SUpdateTableCell;