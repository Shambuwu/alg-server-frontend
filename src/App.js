import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import MeasuringStatusContext from "./hooks/MeasuringStatusContext.tsx";
import UserContext from "./hooks/UserContext.tsx";
import DefaultForm from "./components/DefaultForm.tsx";
import StopMeasurementForm from "./components/StopMeasurementForm.tsx";
import IncomingDataView from "./components/IncomingDataView.tsx";

function App() {
    const [measuringStatus, setMeasuringStatus] = useState(false);
    const [user, setUser] = useState("");

    return (
        <div className="App">
            <header className="App-header">
                <p>🔗️️ Powerchainger HWE-SKT-proxy front-end 🔗️</p>
            </header>
            <MeasuringStatusContext.Provider value={[measuringStatus, setMeasuringStatus]}>
                <UserContext.Provider value={[user, setUser]}>
                    {!measuringStatus ? (
                        <DefaultForm/>
                    ) : (
                        <>
                            <StopMeasurementForm/>
                            <IncomingDataView/>
                        </>
                    )}
                </UserContext.Provider>
            </MeasuringStatusContext.Provider>
        </div>
    );
}

export default App;
