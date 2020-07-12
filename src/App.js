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
import {ReactComponent as NoteLogo} from './Images/noteimg1.svg';
import { useSpring, animated } from 'react-spring'


function App() {
  const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2]
  const trans1 = (x, y) => `translate3d(${x / 20}px,${y / 20}px,0)`
  const [props, set] = useSpring(() => ({ xy: [0, 0], config: { mass: 10, tension: 550, friction: 140 } }))
  const [loginState, setLoginState] = useState(0);
  const [usernameState, setUsernameState] = useState("");

  const keyPress = (event) => {
    if (event.keyCode === 13) {
      onSubmitSignUp();
    }
  };

  const onSubmitSignUp = async (event) => {
    try {
      await app
        .auth()
        .signInWithEmailAndPassword(usernameState + "@notenfapp.com", "123456");
      setLoginState(1);
    } catch (error) {
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(
            usernameState + "@notenfapp.com",
            "123456"
          );
        setLoginState(1);
      } catch (err) {
        alert(err);
      }
    }
  };

  const onClickSignOut = async (event) => {
      try {
          setLoginState(0);
          await app
              .auth()
              .signOut();
      }
      catch(e) {
          alert(e)
      }
  }

  if (loginState) {
    return (
      <div className="App">
        <Helmet>
          <style>{"body {background-color: #eaeaea;"}</style>
        </Helmet>
        <Button
          variant="contained"
          color="secondary"
          className="SignOutButton"
          onClick={onClickSignOut}

        >
          Sign Out
        </Button>
        <Note />
      </div>
    );
  } else {
    return (
      <div className="Login">
        <Helmet>
          <style>{"body {background-color: #1d1e22;"}</style>
        </Helmet>
          <div className="container" onMouseMove={({clientX: x, clientY: y}) => set({xy: calc(x, y)})}>
              <animated.div className="card1" style={{transform: props.xy.interpolate(trans1)}}/>
          </div>


        <div className="LoginPart">
            <div>
                <NoteLogo className="noteLogo1"/>
            </div>

          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >

            <Typography
              color="secondary"
              variant="h3"
              className="welcomeText"
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
