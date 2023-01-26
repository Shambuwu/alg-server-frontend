import {useState, useContext} from "react";
import MeasuringStatusContext from "../hooks/MeasuringStatusContext";
import UserContext from "../hooks/UserContext";
import {checkUserStatusRequest, stopUserMeasurement} from "../api/DataApi";
import ApiForm from "./ApiForm";

export default function StopMeasurementForm() {
    const [context, setContext]: any = useContext(MeasuringStatusContext);
    const [user, setUser]: any = useContext(UserContext);
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");

    async function checkUserStatus(user) {
        try {
            let result = await checkUserStatusRequest(user);
            setContext(result === 'true');
            setStatus(1);
            setMessage(`${user} is currently collecting data`);
        } catch (err) {
            console.log(err)
        }
    }

    let stopMeasurement = async (e) => {
        e.preventDefault();
        try {
            let res = await stopUserMeasurement(user);
            if (res.status === 200) {
                setContext(false)
                setStatus(1);
                setMessage(`${user} is no longer collecting data`);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <ApiForm
            user={user}
            setUser={setUser}
            hideTextField={true}
            action={stopMeasurement}
            status={status}
            message={message}
        />
    )
}