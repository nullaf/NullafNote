import React, { useState } from "react";
import "./Note.scss";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import parse from "html-react-parser";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import Modal from "@material-ui/core/Modal";
import EditIcon from "@material-ui/icons/Edit";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextField from "@material-ui/core/TextField";

function NoteText(props) {
  const [headerState, setHeader] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [headerText, setHeaderText] = useState(props.message);
  const [text, setText] = useState(props.mainMessage);

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
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <div className="noteTextPart">
            <Typography variant="h6" border={1}>
              {headerText}{" "}
            </Typography>
          </div>
          <div className="divIcons">
            <IconButton onClick={handleOpenEdit}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={handleOpen}>
              <ZoomOutMapIcon color="primary" />
            </IconButton>
            <IconButton
              onClick={() => {
                props.delete(props.id);
              }}
            >
              <DeleteIcon color="primary" />
            </IconButton>
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
                  {headerText}
                </Typography>
                <Typography variant="body1" id="simple-modal-description">
                  {parse(text)}
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
                    onChange={(e) => {
                      if (headerText.length < 30) {
                        setHeaderText(e.target.value);
                      }
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
                ) : (
                  <div className="rightHeader">
                    <IconButton
                      onClick={() => {
                        setHeader(1);
                      }}
                    >
                      <EditIcon fontSize="large" />
                    </IconButton>

                    <Typography variant="h3">{headerText}</Typography>
                  </div>
                )}
                <ReactQuill theme="snow" onChange={setText} value={text} />
              </div>
            </Fade>
          </Modal>
        </Grid>
        <div>{parse(text)}</div>
      </div>
    </div>
  );
}

export default NoteText;
