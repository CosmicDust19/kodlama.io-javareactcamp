import {Card, Header, Icon, Segment, Table, Transition} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import PaginationBar from "./PaginationBar";

function ManagementTable
({
     headerContent, color, tableData, footerCells, onAdd, addDisabled, addCellLeft, segmentSize, tableSize,
     open, setOpen, defClosed, scrollable, pageable, ...props
 }) {

    const [defOpen, setDefOpen] = useState(!defClosed);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        return () => {
            setDefOpen(undefined)
            setCurrentPage(undefined)
        };
    }, []);

    const toggle = () => open !== undefined ? setOpen(!open) : setDefOpen(!defOpen)
    const active = open !== undefined ? open : defOpen

    const indexOfLastPosition = currentPage * 10
    const indexOfFirstPosition = indexOfLastPosition - 10
    const currentTableData = pageable ? tableData.slice(indexOfFirstPosition, indexOfLastPosition) : tableData
    const changePage = (e, {activePage}) => setCurrentPage(activePage)

    const addCell =
        [<Table.Cell positive icon={<Icon name={"plus"} style={{marginRight: 0}} disabled={addDisabled}/>}
                     onClick={onAdd} selectable disabled={addDisabled} key={"add"}/>]
    let key = 0
    let footerRow = footerCells ? footerCells.map(cell => <Table.Cell key={key++} content={cell}/>) : null
    footerRow = addCellLeft ? addCell.concat(footerRow) : footerRow?.concat(addCell)

    const tableStyle = scrollable ?
        {marginTop: 0, marginBottom: -15, borderRadius: 0} :
        {marginTop: -12, marginBottom: -15, borderRadius: 0}

    return (
        <div>
            <Card fluid raised style={{borderRadius: 0, userSelect: "none", backgroundColor: "rgb(250,250,250, 0.4)"}}>
                <Card.Header>
                    <Header textAlign={"center"} dividing color={color} content={headerContent} onClick={toggle}
                            style={{marginBottom: -1, marginTop: 0, borderRadius: 0, marginRight: -1,backgroundColor: "rgb(250,250,250, 0.4)"}} block/>
                </Card.Header>
            </Card>
            <Transition visible={active} duration={200} animation={"slide down"}>
                <div>
                    <Segment size={segmentSize} raised vertical
                             style={{marginTop: -15, marginBottom: 10, borderRadius: 0}}>
                        <div className={scrollable ? "container__table" : undefined}>
                            <Table size={tableSize} celled textAlign="center" striped
                                   style={{...tableStyle, backgroundColor: "rgba(255,255,255,0.85)"}}
                                   tableData={currentTableData} footerRow={footerRow} {...props}/>
                        </div>
                    </Segment>

                    {pageable ? <PaginationBar itemsPerPage={10} listedItemsLength={tableData.length} siblingRange={1}
                                               activePage={currentPage} onPageChange={changePage}/> : null}
                </div>
            </Transition>
        </div>
    )
}

export default ManagementTable;