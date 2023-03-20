import { useEffect, useState } from 'react'
import './App.css';
import jwt_decode from "jwt-decode"
function App() {

  const google = window.google;

  const CLIENT_ID = "546667035553-bb7u4ct4o41via932230lgc02732kjhe.apps.googleusercontent.com";

  const SCOPES = "https://www.googleapis.com/auth/drive";

  const [user, setUser] = useState({});
  const [tokenClient, setTokenClient] = useState({});


  function handleCallbackResponse(response) {
    console.log("Encoded JWt ID token: " + response.credential);

    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  function createDriveFile() {
    tokenClient.requestAccessToken();
  }

  useEffect(() => {
    // global google
    google.accounts.id.initialize({

      client_id: CLIENT_ID,
      callback: handleCallbackResponse,

    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

    //Access Tokens
    //Upload to a specific users google drive
    //tokenClient
    setTokenClient
      (google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          console.log(tokenResponse)
          //we now have access to a live token to use for any google apis

          if (tokenResponse && tokenResponse.access_token) {
            //Google Drive API, we are talking to it with HTTP

            //create a file for a certain user
            fetch("https://www.googleapis.com/upload/drive/v3/files", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenResponse.access_token}`
              },
              bosy: JSON.stringify({ "name": "Manisha khan", "mimeType": "text/plain" })
            })
          }
        }
      })
      );
    //tokenClient.requestAccessToken();

    google.accounts.id.prompt();

  }, [])

  return (
    <div className="App">
      <div id="signInDiv"></div>
      {
        Object.keys(user).length != 0 &&
        <button onClick={(e) => handleSignOut(e)}>Sign out</button>
      }

      {
        user &&
        <div>
          <img src={user.picture}></img>
          <h3>{user.name}</h3>
          <input type="submit" onClick={createDriveFile} value="create file"></input>
        </div>
      }
    </div>
  );
}

export default App;
