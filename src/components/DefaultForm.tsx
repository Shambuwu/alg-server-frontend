import {useState, useContext} from "react";
import MeasuringStatusContext from "../hooks/MeasuringStatusContext";
import UserContext from "../hooks/UserContext";
import {startUserMeasurement} from "../api/DataApi";
import ApiForm from "./ApiForm";

export default function DefaultForm() {
    const [context, setContext]: any = useContext(MeasuringStatusContext);
    const [user, setUser]: any = useContext(UserContext);
    const [label, setLabel] = useState("");
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result = await startUserMeasurement(user, label);
            if (result.status === 200) {
                setLabel("");
                setStatus(1);
                setMessage(`Successfully started measurement for user ${user}`);
                setContext(true);
            } else {
                setMessage("An error has occurred");
                setStatus(0);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <ApiForm
            user={user}
            setUser={setUser}
            hideTextField={false}
            label={label}
            setLabel={setLabel}
            action={handleSubmit}
            status={status}
            message={message}
            type={"start"}
        />
    )
}