import {useEffect,useState} from 'react'
import './App.css';
import jwt_decode from "jwt-decode"
function App() {

  const google = window.google;

  const [user, setUser]=useState({});


  function handleCallbackResponse(response){
      console.log("Encoded JWt ID token: "+response.credential);

      var userObject= jwt_decode(response.credential);
      console.log(userObject);
      setUser(userObject);
      document.getElementById("signInDiv").hidden=true;
  }

  function handleSignOut(event){
    setUser({});
    document.getElementById("signInDiv").hidden=false;
  }


useEffect(()=>{
  // global google
  google.accounts.id.initialize({
    
    client_id:"546667035553-bb7u4ct4o41via932230lgc02732kjhe.apps.googleusercontent.com",
    callback: handleCallbackResponse,

  });

  google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    {theme: "outline", size:"large"}
  );

    google.accounts.id.prompt();

},[])

  return (
    <div className="App">
      <div id="signInDiv"></div>
      {
        Object.keys(user).length !=0 &&
        <button onClick={(e)=> handleSignOut(e)}>Sign out</button>
      }
      
      {
        user &&
        <div>
          <img src={user.picture}></img>
          </div>
      }
    </div>
  );
}

export default App;
