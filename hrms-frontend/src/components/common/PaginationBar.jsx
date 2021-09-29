import {Pagination} from "semantic-ui-react";
import React from "react";

function PaginationBar({listedItemsLength, itemsPerPage, basic, ...props}) {

    const totalPages = Math.ceil(listedItemsLength / itemsPerPage)

    return (
        <Pagination
            totalPages={totalPages} secondary pointing siblingRange={2}
            prevItem={null} nextItem={null} boundaryRange={null} ellipsisItem={null} {...props}
        />
    )
}

export default PaginationBar;