import {Menu} from "semantic-ui-react";
import React from "react";

function ItemsPerPageBar({itemPerPage, handleClick, visible, ...props}) {
    const verticalScreen = window.innerWidth < window.innerHeight
    if (visible === false) return null
    return (
        <Menu pointing compact={!verticalScreen} vertical={verticalScreen} color={"blue"} secondary style={{marginLeft: 0}} {...props}>
            <Menu.Item name='5' active={itemPerPage === 5} content={"5"}
                       onClick={() => handleClick(5)} {...props}/>
            <Menu.Item name='10' active={itemPerPage === 10} content={"10"}
                       onClick={() => handleClick(10)} {...props}/>
            <Menu.Item name='20' active={itemPerPage === 20} content={"20"}
                       onClick={() => handleClick(20)}  {...props}/>
            <Menu.Item name='50' active={itemPerPage === 50} content={"50"}
                       onClick={() => handleClick(50)} {...props}/>
            <Menu.Item name='100' active={itemPerPage === 100} content={"100"}
                       onClick={() => handleClick(100)} style={{borderRadius: 0}} {...props}/>
        </Menu>
    )
}

export default ItemsPerPageBar;