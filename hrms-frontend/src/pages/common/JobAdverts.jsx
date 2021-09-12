import React, {useEffect, useState} from "react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {Icon, Loader, Segment} from "semantic-ui-react";
import {useSelector} from "react-redux";
import ItemsPerPageBar from "../../components/common/ItemsPerPageBar";
import PaginationBar from "../../components/common/PaginationBar";
import JobAdvertListSidebar from "../../components/common/JobAdvertListSidebar";
import JobAdvertListPublic from "../../components/common/JobAdvertListPublic";

export default function JobAdverts() {

    const filteredJobAdvertsRedux = useSelector(state => state?.filter.filter.filteredJobAdverts)

    const [jobAdverts, setJobAdverts] = useState();
    const [filteredJobAdverts, setFilteredJobAdverts] = useState(filteredJobAdvertsRedux);
    const [noAdvFound, setNoAdvFound] = useState(false);
    const [itemsPerRow, setItemsPerRow] = useState(2);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertsPerPage, setJobAdvertsPerPage] = useState(10);
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setFilteredJobAdverts(filteredJobAdvertsRedux)
        setLoading(true)
        setTimeout(() => setLoading(false), 300)
    }, [filteredJobAdvertsRedux]);

    useEffect(() => {
        setCurrentPage(1)
        setNoAdvFound(filteredJobAdvertsRedux.length === 0)
        setLoading(true)
        setTimeout(() => setLoading(false), 300)
    }, [filteredJobAdvertsRedux.length]);

    useEffect(() => {
        const jobAdvertisementService = new JobAdvertisementService();
        jobAdvertisementService.getPublic().then((result) => {
            setJobAdverts(result.data.data);
            if (filteredJobAdverts.length === 0) setFilteredJobAdverts(result.data.data);
        });
    }, [filteredJobAdverts.length]);

    useEffect(() => {
        setVerticalScreen(window.innerWidth < window.innerHeight)
        setItemsPerRow(verticalScreen ? 1 : itemsPerRow)
    }, [itemsPerRow, verticalScreen, visible, currentPage]);

    if (!jobAdverts) return <Loader active inline='centered' size={"big"} style={{marginTop: 50}}/>

    const noFilteredJobAdv = filteredJobAdverts.length === 0

    const indexOfLastJobAdvert = currentPage * jobAdvertsPerPage
    const indexOfFirstJobAdvert = indexOfLastJobAdvert - jobAdvertsPerPage
    const currentJobAdverts = noAdvFound ? [] : filteredJobAdverts.slice(indexOfFirstJobAdvert, indexOfLastJobAdvert)

    const disabled = noFilteredJobAdv || noAdvFound

    const itemsPerPageClick = (number) => {
        if (number === jobAdvertsPerPage) return
        setCurrentPage(1);
        setJobAdvertsPerPage(number);
    }

    const changePage = (e, {activePage}) => setCurrentPage(activePage)

    function listingOptions() {
        return (
            <div align={"center"} style={{marginBottom: 30, marginTop: 30}}>

                <ItemsPerPageBar itemPerPage={jobAdvertsPerPage} handleClick={itemsPerPageClick}
                                 disabled={disabled} visible={!verticalScreen}/>

                <PaginationBar itemsPerPage={jobAdvertsPerPage} listedItemsLength={filteredJobAdverts.length} activePage={currentPage}
                               disabled={disabled} onPageChange={changePage}/>

                {!verticalScreen ?
                    itemsPerRow === 1 ?
                        <Icon name={"th large"} onClick={() =>
                            setItemsPerRow(2)} disabled={disabled}
                              style={{marginLeft: 20, marginRight: 20, marginTop: 5, color: "rgba(31,90,211,0.78)"}}/> :
                        itemsPerRow === 2 ?
                            <Icon name={"grid layout"} size="large" onClick={() =>
                                setItemsPerRow(3)} disabled={disabled}
                                  style={{marginLeft: 20, marginRight: 20, marginTop: 5, color: "rgba(31,90,211,0.78)"}}/> :
                            itemsPerRow === 3 ?
                                <Icon name={"th list"} size="large" onClick={() =>
                                    setItemsPerRow(1)} disabled={disabled}
                                      style={{marginLeft: 20, marginRight: 20, marginTop: 5, color: "rgba(31,90,211,0.78)"}}/> :
                                null : null
                }
            </div>

        )
    }

    return (
        <Segment padded style={{marginTop: -40}} basic vertical={verticalScreen}>
            <JobAdvertListSidebar jobAdvertsPerPage={jobAdvertsPerPage} itemsPerPageClick={itemsPerPageClick} visible={visible}
                                  setVisible={setVisible} jobAdverts={jobAdverts}/>
            {listingOptions()}
            <JobAdvertListPublic jobAdverts={currentJobAdverts} itemsPerRow={itemsPerRow} loading={loading}
                                 noAdvPublished={jobAdverts.length === 0}/>
        </Segment>
    );
}