import logo from './logo.svg';
import './App.css';
import {useState, Component, useContext, createContext} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";

const MeasuringStatusContext = createContext(null);
const UserContext = createContext(null);

function FormComponentB() {
    const [context, setContext] = useContext(MeasuringStatusContext);
    const [user, setUser] = useContext(UserContext);
    const [label, setLabel] = useState("");
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        checkUserStatus(user).then(async () => {
                try {
                    let res = await fetch(`http://77.172.199.5:8080/data/start_measurement/${user}/${label}`, {
                        method: "POST",
                    });
                    if (res.status === 200) {
                        setLabel("");
                        setStatus(1);
                        setMessage(`Successfully started measurement for user ${user}`);
                        setContext(false);
                    } else {
                        setMessage("An error has occurred");
                        setStatus(0);
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        );
    }

    async function checkUserStatus(user) {
        try {
            let res = await fetch(`http://77.172.199.5:8080/data/get/${user}/measure_proxy`, {
                method: "POST",
            });
            if (res.status === 200) {
                console.log(res.body);
                setContext(false);
            } else {
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <FormControl
            onSubmit={handleSubmit}
            sx={{
                m: 1,
                display: "inline-block"
            }}
            size="small"
        >
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
                value={user}
                label="User"
                onChange={(e) => {
                    setUser(e.target.value)
                    checkUserStatus(user).then(test => console.log(test))
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
            <TextField
                type="text"
                value={label}
                placeholder="Label"
                onChange={(e) => setLabel(e.target.value)}
                size="small"
                sx={{
                    minWidth: "200px",
                    maxWidth: "200px",
                    input: {
                        color: "aliceblue"
                    },
                    fieldset: {borderColor: 'rgba(228, 219, 233, 0.25)'},
                    "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                            borderColor: 'rgba(228, 219, 233, 0.25)'
                        },
                    },
                }}
            />
            <Button
                onClick={handleSubmit}
                type="submit"
                variant="outlined"
                sx={{
                    color: 'rgba(228, 219, 233, 0.50)',
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                    minWidth: "200px"
                }}
            >
                Start Measurement
            </Button>
            <FormMessage message={message} status={status}/>
        </FormControl>
    );
}

function StopMeasureComponent(props) {
    const [context, setContext] = useContext(MeasuringStatusContext);
    const [userContext, setUserContext] = useContext(UserContext);

    let stopMeasurement = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(`http://77.172.199.5:8080/data/stop_measurement/${userContext}`, {
                method: "POST",
            });
            if (res.status === 200) {
                setContext(false)
            } else {
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Button
                onClick={stopMeasurement}
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
        </>
    )
}

function FormMessage(props) {
    return (
        <div className="message">{
            props.message ?
                props.status === 1 ?
                    <p style={{color: "green"}}>✅ - {props.message}</p> : <p style={{color: "red"}}>⚠️ - {props.message}</p>
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
                {!measuringStatus ? <FormComponentB/> : <UserContext value={[user, setUser]}><StopMeasureComponent/></UserContext>}
            </MeasuringStatusContext.Provider>
        </div>
    );
}

export default App;
