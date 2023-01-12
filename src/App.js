import logo from './logo.svg';
import './App.css';
import {useState, Component, useContext, createContext, useEffect} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";

const MeasuringStatusContext = createContext(null);
const UserContext = createContext(null);

function IncomingDataView() {
    const [incomingData, setIncomingData] = useState([]);
    const [user, setUser] = useContext(UserContext);

    // useEffect(() => {
    //     setInterval(() => {
    //         fetch(`77.172.199.5:8080/data/data_entry/levi/1`).then(r => {
    //             return r.body
    //         }).then(r => {
    //             console.log(r)
    //         });
    //         // setIncomingData([...incomingData, "test\n"])
    //     }, 1000)
    // })

    return (
        <pre>
            {incomingData ? incomingData : null}
        </pre>
    )
}

function FormComponentB() {
    const [context, setContext] = useContext(MeasuringStatusContext);
    const [user, setUser] = useContext(UserContext);
    const [label, setLabel] = useState("");
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(`http://77.172.199.5:8080/data/start_measurement/${user}/${label}`, {
                method: "POST",
            });
            if (res.status === 200) {
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


    async function checkUserStatus(user) {
        try {
            let res = await fetch(`http://77.172.199.5:8080/data/get/${user}/measure_proxy`, {
                method: "POST",
            });
            res.text().then((r) => {
                setContext(r === 'true');
                setStatus(1);
            });
        } catch (err) {
            console.log(err)
        }
    }

    return (
		<MeasurementForm user={user} status={status} action={handleSubmit}/>
    );
}

function StopMeasureComponent() {
    const [context, setContext] = useContext(MeasuringStatusContext);
    const [user, setUser] = useContext(UserContext);
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");

    async function checkUserStatus(user) {
        try {
            let res = await fetch(`http://77.172.199.5:8080/data/get/${user}/measure_proxy`, {
                method: "POST",
            });
            res.text().then((r) => {
                setContext(r === 'true');
                setStatus(1);
                setMessage(`${user} is currently collecting data`);
            });
        } catch (err) {
            console.log(err)
        }
    }

    let stopMeasurement = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(`http://77.172.199.5:8080/data/stop_measurement/${user}`, {
                method: "POST",
            });
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
		<MeasurementForm user={user} status={status} action={stopMeasurement}/>
    )
}

function MeasurementForm(props) {
	return (
		<FormControl
            sx={{
                m: 1,
                display: "inline-block"
            }}
            size="small"
        >
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
                size="small"
                value={props.user}
                label="User"
                onChange={(e) => {
                    checkUserStatus(e.target.value).then(() => {
                        setUser(e.target.value)
                    })
                }}
                sx={{
                    minWidth: "200px",
                    color: "white",
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(228, 219, 233, 0.25)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(228, 219, 233, 0.25)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(228, 219, 233, 0.25)',
                    },
                    '.MuiSvgIcon-root ': {
                        fill: "white !important",
                    },
                    'input': {
                        '&::placeholder': {
                            textOverflow: 'ellipsis !important',
                            color: 'blue'
                        }
                    }
                }}
            >
                <MenuItem value={"levi"}>Levi</MenuItem>
                <MenuItem value={"kevin"}>Kevin</MenuItem>
                <MenuItem value={"geert"}>Geert</MenuItem>
            </Select>
            <Button
                onClick={props.action}
                type="submit"
                variant="outlined"
                sx={{
                    color: '#B90E0A',
                    borderColor: '#B90E0A',
                    minWidth: "200px"
                }}
            >
                Stop Measurement
            </Button>
            <FormMessage message={props.message} status={props.status}/>
        </FormControl>
	);
}

function FormMessage(props) {
    return (
        <div className="message">{
            props.message ?
                props.status === 1 ?
                    <p style={{color: "green"}}>✅ - {props.message}</p> :
                    <p style={{color: "red"}}>⚠️ - {props.message}</p>
                : null
        }
        </div>
    )
}


function App() {
    const [measuringStatus, setMeasuringStatus] = useState(false);
    const [user, setUser] = useState("");

    return (
        <div className="App">
            <header className="App-header">
                <p>⚕️️ Powerchainger HWE-SKT-proxy front-end ⚕️</p>
            </header>
            <MeasuringStatusContext.Provider value={[measuringStatus, setMeasuringStatus]}>
                <UserContext.Provider value={[user, setUser]}>
                    {!measuringStatus ? <FormComponentB/> : <StopMeasureComponent/>}
                    <IncomingDataView/>
                </UserContext.Provider>
            </MeasuringStatusContext.Provider>
        </div>
    );
}

export default App;
