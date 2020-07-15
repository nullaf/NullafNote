import React, { useEffect, useState } from "react";
import "./Note.scss";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NoteText from "./NoteText";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import firebase from "./firebase";
import app from "./firebase";
import CircularProgress from "@material-ui/core/CircularProgress";

function Note(props) {
  const [headerState, setHeader] = useState(0);
  const [headerText, setHeaderText] = useState("Header");

  const [text, setText] = useState("");
  const [editorState, setEditor] = useState(EditorState.createEmpty());
  const [searchState, setSearchState] = useState("");
  const [headers, setHeaders] = useState([]);
  const [changeState, setChangeState] = useState(0);
  const [keyState, setKeyState] = useState(props.keyValue);
  const [keyDataState, setKeyData] = useState(0);
  const [dataFetchState, setDataFetchState] = useState(1);
  let maxNumber = 0;

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    firebase.firestore().doc(`notes/${uid}`).set({
      string: "sth",
    });
    firebase
      .firestore()
      .collection("notes")
      .doc(uid)
      .collection("userNotes")
      .onSnapshot((snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHeaders([]);
        newData.forEach((val) => {
          setHeaders((headers) => [
            { id: val.id, message: val.message, mainMessage: val.mainMessage },
            ...headers,
          ]);
        });
      });
  }, [keyDataState]);

  const addHeader = () => {
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].id > maxNumber) {
        maxNumber = headers[i].id;
      }
    }

    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection("notes")
      .doc(uid)
      .collection("userNotes")
      .add({
        id: maxNumber + 1,
        message: headerText,
        mainMessage: text,
      });

    setHeaderText("Header");
    setText("");
    setEditor(EditorState.createEmpty());
  };

  const deleteNote = (id) => {
    const uid = firebase.auth().currentUser.uid;
    setHeaders(headers.filter((note) => note.id !== id));
    const queryData = firebase
      .firestore()
      .collection("notes")
      .doc(uid)
      .collection("userNotes")
      .where("id", "==", id);
    queryData.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

  const onEditorStateChange = (editorState) => {
    setText(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    return setEditor(editorState);
  };

  const onClickChangeButton = async (event) => {
    try {
      setDataFetchState(1);
      setKeyState("");
      setChangeState(1);
      setHeaders([]);
      await app.auth().signOut();
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeKey = async (event) => {
    if (/^\S+$/g.test(keyState)) setDataFetchState(0);
    try {
      await app
        .auth()
        .signInWithEmailAndPassword(keyState + "@notenfapp.com", "123456");
      setDataFetchState(1);
      setKeyData(keyDataState + 1);
      setHeaders([]);
      setChangeState(0);
    } catch (error) {
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(
            keyState + "@notenfapp.com",
            "123456"
          );
        setHeaders([]);
        setChangeState(0);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const keyPress = (event) => {
    if (event.keyCode === 13) {
      onChangeKey();
    }
  };

  return (
    <div className="Note">
      <div className="rightPart">
        <div className="header">
          {headerState ? (
            <ClickAwayListener
              onClickAway={() => {
                if (headerText !== "") {
                  setHeader(0);
                }
              }}
            >
              <TextField
                onClick={() => {}}
                variant="outlined"
                color="secondary"
                fullWidth
                value={headerText}
                onChange={(e) => {
                  setHeaderText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    if (headerText !== "") {
                      setHeader(0);
                    }
                  }
                }}
                autoFocus
              />
            </ClickAwayListener>
          ) : (
            <div onClick={() => setHeader(1)} className="rightHeader">
              <Typography variant="h3">{headerText}</Typography>
            </div>
          )}
        </div>
        <div className="quill">
          <Editor
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "link",
                "history",
              ],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
            }}
          />

          <div className="addNoteButton">
            <Button
              onClick={() => addHeader()}
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<AddIcon />}
            >
              Add Note
            </Button>
          </div>
        </div>
        <div className="keyPart">
          {changeState ? (
            <div className="donePart">
              <Typography variant="h4">Key: </Typography>
              {!dataFetchState ? (
                <CircularProgress
                  style={{ marginLeft: 15 }}
                  color="secondary"
                />
              ) : (
                <ClickAwayListener onClickAway={onChangeKey}>
                  <TextField
                    color="secondary"
                    variant="outlined"
                    size="small"
                    style={{ marginLeft: 15 }}
                    value={keyState}
                    onKeyDown={keyPress}
                    onChange={(e) => {
                      setKeyState(e.target.value);
                    }}
                  />
                </ClickAwayListener>
              )}

              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={onChangeKey}
                disabled={!/^\S+$/g.test(keyState)}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="changePart">
              <Typography variant="h4">Key: {keyState}</Typography>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={onClickChangeButton}
              >
                Change
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="addPart">
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
        >
          <div className="searchbarPart">
            <TextField
              variant="outlined"
              value={searchState}
              onChange={(e) => {
                setSearchState(e.target.value);
              }}
              color="secondary"
              label="Search"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="textFieldPart">
            {searchState === ""
              ? headers.map((note) => (
                  <NoteText
                    mainMessage={note.mainMessage}
                    message={note.message}
                    id={note.id}
                    delete={(id) => deleteNote(id)}
                  />
                ))
              : headers.map((note) =>
                  note.message
                    .toLowerCase()
                    .search(searchState.toLowerCase()) !== -1 ||
                  note.mainMessage
                    .toLowerCase()
                    .search(searchState.toLowerCase()) !== -1 ? (
                    <NoteText
                      mainMessage={note.mainMessage}
                      message={note.message}
                      id={note.id}
                      delete={(id) => deleteNote(id)}
                    />
                  ) : null
                )}
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Note;
