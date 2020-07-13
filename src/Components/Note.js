import React, { useState, useEffect } from "react";
import "./Note.scss";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NoteText from "./NoteText";
import Quill from "quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";


function Note() {
  const [headerState, setHeader] = useState(0);
  const [headerText, setHeaderText] = useState("Header");
  const [headers, setHeaders] = useState([]);
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);

  const Link = Quill.import("formats/link");
  Link.sanitize = function (url) {
    if (url.search("http") === -1) {
      url = "https:" + url;
      return url;
    }
    return url;
  };


  useEffect(() => {
    setText("")
  }, [headers]);

  const addHeader = () => {
    setHeaders([
      { id: count + 1, message: headerText, mainMessage: text },
      ...headers,
    ]);
    setCount(count + 1);
    setHeaderText("Header");
    setText("")
  };

  const deleteNote = (id) => {
    setHeaders(headers.filter((note) => note.id !== id));
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
              <Typography variant="h3">
                {headerText}
              </Typography>
            </div>
          )}
        </div>
        <div className="quill">
          <ReactQuill theme="snow" onChange={setText} value={text} />
        </div>
        <div className="addNoteButton">
          <Button
            onClick={addHeader}
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
          >
            Add Note
          </Button>
        </div>
      </div>

      <div className="addPart">
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
        >
          <div className="textFieldPart">
            {headers.map((note) => (
              <NoteText
                mainMessage={note.mainMessage}
                message={note.message}
                id={note.id}
                delete={(id) => deleteNote(id)}
              />
            ))}
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Note;
