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
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import LinearProgress from "@material-ui/core/LinearProgress";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import File from "./File";

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

  let deleteAudio = new Audio("/remove.wav");

  useEffect(() => {
    firebase.firestore().doc(`keys/${keyState}`).set({
      string: "sth",
    });
    firebase
      .firestore()
      .collection("keys")
      .doc(keyState)
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
    // eslint-disable-next-line
  }, [keyDataState]);

  const addHeader = () => {
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].id > maxNumber) {
        maxNumber = headers[i].id;
      }
    }

    firebase
      .firestore()
      .collection("keys")
      .doc(keyState)
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
    deleteAudio.play();
    setHeaders(headers.filter((note) => note.id !== id));
    const queryData = firebase
      .firestore()
      .collection("keys")
      .doc(keyState)
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
      setFiles([]);
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
      setFiles([]);
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
        setFiles([]);
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

  const [upProgress, setUpProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [inputText, setInputText] = useState(null);
  let audio = new Audio("/success.mp3");

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(keyState + "/" + file.name);

    const uploadTask = fileRef.put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setUpProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        audio.play();
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          firebase.firestore().collection(`keys/${keyState}/userFiles`).add({
            fileName: file.name,
            downloadUrl: downloadURL,
          });
        });
        setUpProgress(0);
        setSuccessMessage("You uploaded your file successfully!");
        setInputText(Date.now());
        setTimeout(() => {
          setSuccessMessage("");
        }, 2500);
      }
    );
  };
  const onSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("keys")
      .doc(keyState)
      .collection("userFiles")
      .onSnapshot((snapshot) => {
        const newFileData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiles([]);
        newFileData.forEach((val) => {
          setFiles((files) => [
            { fileName: val.fileName, downloadUrl: val.downloadUrl },
            ...files,
          ]);
        });
      });
    // eslint-disable-next-line
  }, [keyDataState]);

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
                "fontSize",
                "list",
                "textAlign",
                "link",
                "colorPicker",
                "history",
              ],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
            }}
          />
        </div>
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
        <div className="addFile">
          <Typography variant="h4" color="secondary">
            Attach File
          </Typography>
          <FormControl onSubmit={onSubmit} color="secondary">
            <Input
              id="my-input"
              type="file"
              color="secondary"
              key={inputText}
              onChange={onFileChange}
            />

            <Button
              startIcon={<AttachFileIcon color="secondary" />}
              variant="outlined"
              color="secondary"
              style={{ marginTop: 10 }}
            >
              Submit
            </Button>
          </FormControl>
          {upProgress === 0 ? null : (
            <div
              className="progressbarPart"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <LinearProgress
                variant="determinate"
                color="secondary"
                value={upProgress}
                style={{ width: "90%" }}
              />
              <Typography color="secondary" style={{ marginLeft: 5 }}>
                {upProgress}%
              </Typography>
            </div>
          )}
        </div>
        <div
          className="addFile"
          style={{ padding: 0, marginTop: 0, marginBottom: 10 }}
        >
          {successMessage !== "" ? (
            <Typography style={{ backgroundColor: "lightgreen" }}>
              {successMessage}
            </Typography>
          ) : null}
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
            {files.length !== 0 ? (
              <div className="filesHeader">
                <Typography variant="h3" color="secondary">
                  Files
                </Typography>{" "}
              </div>
            ) : null}
            <div className="filesPart" style={files.length === 0 ? {display:"none"} : null}>
              {searchState === ""
                ? files.map((file) => (
                    <File
                      fileName={file.fileName}
                      downloadUrl={file.downloadUrl}
                      keyState={keyState}
                    />
                  ))
                : files.map((file) =>
                    file.fileName
                      .toLowerCase()
                      .search(searchState.toLowerCase()) !== -1 ? (
                      <File
                        fileName={file.fileName}
                        downloadUrl={file.downloadUrl}
                        keyState={keyState}
                      />
                    ) : null
                  )}
            </div>
            {headers.length !== 0 ? (
                <div className="notesHeader">
                  <Typography variant="h3" color="secondary">
                    Notes
                  </Typography>
                </div>
            ) : null}
            <div className="textNotesPart">
              {searchState === ""
                ? headers.map((note) => (
                    <NoteText
                      keyState={keyState}
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
                        keyState={keyState}
                        mainMessage={note.mainMessage}
                        message={note.message}
                        id={note.id}
                        delete={(id) => deleteNote(id)}
                      />
                    ) : null
                  )}
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Note;
