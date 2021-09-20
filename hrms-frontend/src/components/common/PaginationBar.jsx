import {Pagination} from "semantic-ui-react";
import React from "react";

function PaginationBar({listedItemsLength, itemsPerPage, basic, ...props}) {

    const totalPages = Math.ceil(listedItemsLength / itemsPerPage)

    if (basic) return (
        <Pagination
            totalPages={totalPages} secondary pointing siblingRange={1}
            ellipsisItem={null} boundaryRange={null} prevItem={null} nextItem={null} {...props}
        />
    )

    return (
        <Pagination
            totalPages={totalPages} secondary pointing
            firstItem={null} lastItem={null} siblingRange={2} {...props}
        />
    )
}

export default PaginationBar;