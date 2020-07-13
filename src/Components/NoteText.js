import React, { useState, useEffect } from "react";
import "./Note.scss";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import parse from "html-react-parser";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import Modal from "@material-ui/core/Modal";
import EditIcon from "@material-ui/icons/Edit";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { EditorState, convertToRaw , ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';

function NoteText(props) {
  const [header, setHeaderState] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [headerTextMain, setHeaderTextMain] = useState(props.message);
  const [mainText, setMainText] = useState(props.mainMessage);

  const onEditorStateChange = editorState => {
    setMainText(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    return setEditor(editorState)
  }
  const blocksFromHtml = htmlToDraft(props.mainMessage);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  const [editorState,setEditor] = useState(EditorState.createWithContent(contentState));

  useEffect(() => {
    setEditor(EditorState.createWithContent(contentState))
    setMainText(props.mainMessage);
    setHeaderTextMain(props.message);
  // eslint-disable-next-line
  }, [props.message, props.mainMessage]);



  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  return (
    <div className="NoteText">
      <div className="NoteTextGrid">
        <div className="iconsAndText">

          <div className="noteTextPart">
            <Typography variant="h6" border={1}>
              {headerTextMain}
            </Typography>
          </div>
          <div className="divIcons">
            <IconButton onClick={handleOpenEdit}>
              <EditIcon color="secondary" />
            </IconButton>
            <IconButton onClick={handleOpen}>
              <ZoomOutMapIcon color="secondary" />
            </IconButton>
            <IconButton
              onClick={() => {
                props.delete(props.id);
              }}
            >
              <DeleteIcon color="secondary" />
            </IconButton>
          </div>
        </div>

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className="messageBodyStyle">
                <Typography variant="h4" id="simple-modal-title">
                  {headerTextMain}
                </Typography>
                <Typography variant="body1" id="simple-modal-description">
                  {parse(mainText)}
                </Typography>
              </div>
            </Fade>
          </Modal>

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openEdit}
            onClose={handleCloseEdit}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openEdit}>
              <div className="messageBodyStyle">
                {header ? (
                  <ClickAwayListener
                    onClickAway={() => {
                      if (headerTextMain !== "") {
                        setHeaderState(0);
                      }
                    }}
                  >
                    <TextField
                      onClick={() => {}}
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      value={headerTextMain}
                      onChange={(e) => {
                        if (headerTextMain.length < 30) {
                          setHeaderTextMain(e.target.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          if (headerTextMain !== "") {
                            setHeaderState(0);
                          }
                        }
                      }}
                      autoFocus
                    />
                  </ClickAwayListener>
                ) : (
                  <div className="rightHeader" onClick={() => {
                    setHeaderState(1);
                  }}>
                    <Typography
                      variant="h3"

                    >
                      {headerTextMain}
                    </Typography>
                  </div>
                )}
                <div className="editQuill">
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
              </div>
            </Fade>
          </Modal>

        <div>{parse(mainText)}</div>
      </div>
    </div>
  );
}

export default NoteText;
