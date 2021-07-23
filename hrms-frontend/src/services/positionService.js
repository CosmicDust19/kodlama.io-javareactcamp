import axios from "axios"

export default class PositionService {

    getPositions() {
        return axios.get("http://localhost:8080/api/positions/get/all");
    }

    addPosition(positionTitle) {
        return axios.post(`http://localhost:8080/api/positions/add?positionTitle=${positionTitle}`)
    }

}