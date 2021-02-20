import React, { useEffect, useState } from 'react';
import { Redirect, Link } from "react-router-dom";
import Artist from './Artist';
import CheckedArtist from './CheckedArtist';
import Header from "./Header";
import Guide from "./Guide";
import Logout from "./Logout";

export default function User(props) {
    const [artists, setArtists] = useState([]);
    const [redirect, setRedirect] = useState("");
    const [checkedItems, setCheckedItems] = useState({});
    const [isBtnHide, setIsBtnHide] = useState(true);
    const userUri = "http://localhost:9990/api/user";
    const deleteUri = "http://localhost:9990/api/delete";

    useEffect(() => {
        fetch(userUri, {credentials: "include"})  
            .then(response => response.json())
            .then((json) => {
            console.log(json)
            setArtists(json.artists)
            setRedirect(json.result)
            console.log(artists)});
    }, []);

    useEffect(() => {
        //checkedItemsが空では無い場合、送信ボタンを表示させる
        Object.keys(checkedItems).length && setIsBtnHide(false)
        setTimeout(() => {
        if (
            Object.values(checkedItems).every(checkedItem => {
              return checkedItem === false
        })) {
            setIsBtnHide(true)
        }
        },100);
    }, [checkedItems]);

    const handleChange = e => {
        //checkedItemsのstateをセット
        let newCheckedItems = {
            ...checkedItems,
            [e.target.id]: e.target.checked}
        setCheckedItems(newCheckedItems)
    };

    const dataSendBtn = e => {
        //既定のイベントをキャンセルさせる
        e.preventDefault()
        //送信ボタンを押したタイミングで、checkedItemsオブジェクトのvalueがtrueのkeyのみを配列にしてconsoleに表示させる
        const dataPushArray = Object.entries(checkedItems).reduce((pre,[key, value])=>{
            value && pre.push(key)
            return pre
        },[])
        console.log("dataPushArray:", dataPushArray)
        fetch(deleteUri, {
            method: "POST",
            credentials: "include",
            headers: {
                // "Content-Type": "application/json"
            },
            body: JSON.stringify({"artistsId": dataPushArray})
        }).then(response => response.json())
            .then((json) => {
                console.log(json)
                setArtists(json.artists)
                setRedirect(json.result)
                setIsBtnHide(false)
                setCheckedItems({})
                console.log("push")})
    }

    return (
        <div className="page">
            {redirect === "redirect" ? 
                (<div>
                <Redirect to="/" />
                </div>) 
                : 
                (<div className="user-page">
                    <Header />
                    <div className="navi-container"> 
                        <Guide />
                        <Link to ="/setting" id="to-setting">
                            <img id="settings-icon" src="../img/icons/png/017-settings.png"/>
                            setting
                        </Link>
                        <Logout />
                        {!isBtnHide && <div className="delete-button-div"><button className="delete-button" onClick={dataSendBtn}>Don't add tracks by selected artists</button></div>}
                    </div>
                    <div className="artistContainer">
                    {
                        artists.map(artist => {
                        if (checkedItems[artist.ArtistId]) {
                            return <CheckedArtist 
                                id={artist.ArtistId} 
                                name={artist.Name} 
                                url={artist.Url} 
                                iconUrl={artist.IconUrl} 
                                key={artist.ArtistId}
                                onChange={handleChange}
                                checked={checkedItems[artist.ArtistId]}
                            />
                        } else {
                            return <Artist 
                                id={artist.ArtistId} 
                                name={artist.Name} 
                                url={artist.Url} 
                                iconUrl={artist.IconUrl} 
                                key={artist.ArtistId}
                                onChange={handleChange}
                                checked={checkedItems[artist.ArtistId]}
                            />
                        }})
                    }
                    </div>
                    <div className="footer">Icons in navigation bar made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                </div>)
            }
        </div>
    );
}
