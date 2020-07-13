import React, { useState } from "react";
import "./Note.scss";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NoteText from "./NoteText";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


function Note() {
  const [headerState, setHeader] = useState(0);
  const [headerText, setHeaderText] = useState("Header");
  const [headers, setHeaders] = useState([]);
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const [editorState,setEditor] = useState(EditorState.createEmpty())


  const addHeader = () => {

    setHeaders([
      { id: count + 1, message: headerText, mainMessage: text },
      ...headers,
    ]);
    setCount(count + 1);
    setHeaderText("Header");
    setText("")
    setEditor(EditorState.createEmpty())
  };

  const deleteNote = (id) => {
    setHeaders(headers.filter((note) => note.id !== id));
  };

  const onEditorStateChange = editorState => {
    setText(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    return setEditor(editorState)
  }

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
          <Editor
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'history'],
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
