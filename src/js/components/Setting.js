import React, { useEffect, useState } from 'react';
import { Redirect, Link, useHistory } from "react-router-dom";
import Header from "./Header";
import Logout from "./Logout";
import Toggle from "./Toggle";
import Navigator from "./Navigator";

export default function Setting(props) {
    const history = useHistory();
    const [redirect, setRedirect] = useState("");
    const [remix, setRemix] = useState(false);
    const [acoustic, setAcoustic] = useState(false);
    const [saved, setSaved] = useState(false);
    const settingUri = window._env_.LOCAL_SETTING_URI;
    const saveUri = window._env_.LOCAL_SAVE_URI;

    useEffect(() => {
        fetch(settingUri, {credentials: "include"})
            .then(response => response.json())
            .then((json) => {
		        console.log(json)
                setRemix(json.ifRemixAdd)
                setAcoustic(json.ifAcousticAdd)
                setRedirect(json.Result)
            })
    }, []);

    const handleSaveClick = () => {
        fetch(saveUri, {
            method: "POST",
            credentials: "include",
            headers: {
                // "Content-Type": "application/json"
            },
            body: JSON.stringify({"ifRemixAdd": remix, "ifAcousticAdd": acoustic})
        }).then(response => response.json())
            .then((json) => {
                if (json.result === "success") {
                    setSaved(true);
                }})
    }

    const handleRemixChange = () => {
        setRemix(!remix); 
        setSaved(false);
    }

    const handleAcousticChange = () => {
        setAcoustic(!acoustic); 
        setSaved(false);
    }

    const handleButtonClick = () => {
        history.goBack();
    }

    return (
        <div className="page">
            {redirect === "redirect" ? 
                (<div>
                <Redirect to="/" />
                </div>) 
                : 
                (<div className="setting-page">
                    <Header />
                    <Navigator page="settingpage" onClick={handleButtonClick} />
                    <div className="setting-explanation">
                        You can edit whether you want remix tracks or acoustic tracks in your playlist here. <br/>
                    </div>

                    <Toggle className="remix" name="remix" onChange={handleRemixChange} flag={remix} />
                    <p id="remix-off-explanation">
                        If you set remix off, the application will remove tracks named "(track name)- Remix".
                    </p>

                    <Toggle className="acoustic" name="acoustic" onChange={handleAcousticChange} flag={acoustic} />
                    <p id="acoustic-off-explanation">
                    If you set acoustic off, the application will remove tracks named "(track name) - Acoustic".
                    </p>

                    <div className="save">
                        <button type="button" onClick={handleSaveClick}>Save</button> 
                    </div>
                    {saved ? <p id="saved">saved</p> : <p></p>}
                    <div className="footer">Icons in navigation bar made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                </div>)
            }
        </div>
    )

}
