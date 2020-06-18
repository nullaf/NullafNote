import React, { useState } from "react";
import "./App.css";
import app from "./Components/firebase";
import { Helmet } from "react-helmet";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Note from "./Components/Note";


function App() {

  const [loginState, setLoginState] = useState(0);
  const [usernameState, setUsernameState] = useState("");

  const keyPress = (event) => {
    if (event.keyCode === 13) {
      onSubmitSignUp();
    }
  };

  const onSubmitSignUp = async (event) => {

    try {
      const user = await app
        .auth()
        .createUserWithEmailAndPassword(
          usernameState + "@notenfapp.com",
          "123456"
        );
      setLoginState(1);
    } catch (error) {
      const user = await app
        .auth()
        .signInWithEmailAndPassword(usernameState + "@notenfapp.com", "123456");
      setLoginState(1);
    }
  };

  if (loginState) {
    return (
      <div className="App">
        <Helmet>
          <style>{"body {background-color: #eaeaea;"}</style>
        </Helmet>
        <Button variant="contained" className="SignOutButton" onClick={() => {setLoginState(0)}}>Sign Out</Button>
        <Note/>
      </div>
    );
  } else {
    return (
      <div className="Login">
        <Helmet>
          <style>{"body {background-color: #1d1e22;"}</style>
        </Helmet>
        <div className="LoginPart">
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography
              style={{ marginTop: "0.2em" }}
              color="secondary"
              variant="h3"
            >
              Welcome
            </Typography>

            <TextField
              color="secondary"
              style={{ marginTop: "1.5em" }}
              fullWidth
              autoFocus
              required
              variant="outlined"
              label="Username"
              value={usernameState}
              type="text"
              onKeyDown={keyPress}
              onChange={(e) => setUsernameState(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="secondary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              style={{ marginTop: "1.5em" }}
              variant="contained"
              size="large"
              color="secondary"
              type="submit"
              onClick={onSubmitSignUp}
              disabled={usernameState === ""}
            >
              Sign In
            </Button>
          </Grid>
        </div>
      </div>
    );
  }
}

export default App;
