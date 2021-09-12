import {Pagination} from "semantic-ui-react";
import React from "react";

function PaginationBar({listedItemsLength, itemsPerPage, ...props}) {
    return (
        <Pagination
            totalPages={Math.ceil(listedItemsLength / itemsPerPage)} secondary pointing
            firstItem={null} lastItem={null} siblingRange={2} {...props}
        />
    )
}

export default PaginationBar;