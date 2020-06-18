import React, { useState } from "react";
import "./Note.scss";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NoteText from "./NoteText";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

function Note() {
  const [headerState, setHeader] = useState(0);
  const [headerText, setHeaderText] = useState("Header");
  const [headers, setHeaders] = useState([]);
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);




  const addHeader = () => {
    if(text !== "") {
      setHeaders([{id: count + 1, message: headerText, mainMessage: text}, ...headers]);
      setCount(count + 1);
      setHeaderText("Header")
      setText("")
    }
  };

  const deleteNote = (id) => {
    setHeaders(headers.filter((note) => note.id !== id));
  };



  return (
    <div className="Note">

        <div className="addPart">
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Button
              onClick={addHeader}
              variant="contained"
              color="primary"
              className="addNoteButton"
              fullWidth
            >
              Add Note
            </Button>
            <div className="textFieldPart">
              {headers.map((note) => (
                <NoteText
                  mainMessage = {note.mainMessage}
                  message={note.message}
                  id={note.id}
                  delete={(id) => deleteNote(id)}
                />
              ))}
            </div>
          </Grid>
        </div>
        <div className="rightPart">
          <div className="header">
            {headerState ? (
              <TextField
                onClick={() => {
                  if (headerText !== "") {
                    setHeader(0);
                  }
                }}
                variant="outlined"
                fullWidth
                value={headerText}
                onChange={(e) => {if(headerText.length < 30) {setHeaderText(e.target.value)}}}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    if (headerText !== "") {
                      setHeader(0);
                    }
                  }
                }}
                autoFocus
              />
            ) : (
                <div className="rightHeader">


                <IconButton onClick={() => {
                  setHeader(1);
                }}>
                  <EditIcon fontSize="large"/>
                </IconButton>

                <Typography

                  variant="h3"
                >
                  {headerText}
                </Typography>
                </div>
            )}
          </div>
          <div className="quill">
            <ReactQuill
              theme="snow"
              onChange={setText}
              value={text}
            />
          </div>
        </div>

    </div>
  );
}

export default Note;
