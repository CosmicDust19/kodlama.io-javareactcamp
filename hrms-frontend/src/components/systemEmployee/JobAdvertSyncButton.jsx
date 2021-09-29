import {useDispatch, useSelector} from "react-redux";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {Button} from "semantic-ui-react";
import {useEffect, useState} from "react";
import {getFilteredJobAdverts} from "../../utilities/JobAdvertUtils";
import {changeFilteredJobAdverts} from "../../store/actions/listingActions";

export default function JobAdvertSyncButton({visible}) {

    const jobAdvertService = new JobAdvertisementService()

    const dispatch = useDispatch();
    const filters = useSelector(state => state?.listingReducer.listingProps.jobAdverts.filters);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        return () => setLoading(undefined)
    }, []);

    if (!visible) return null

    const sync = () => {
        setLoading(true)
        jobAdvertService.getAll().then(r => {
            const filteredJobAdverts = getFilteredJobAdverts(r.data.data, filters)
            dispatch(changeFilteredJobAdverts(filteredJobAdverts))
        }).finally(() => setLoading(false))
    }

    return (
        <Button circular loading={loading} onClick={sync} icon={"sync"} compact floated={"right"} disabled={loading}
                style={{marginTop: 10, marginLeft: -30, backgroundColor: "rgba(238,238,238,0.2)"}}/>
    )
}