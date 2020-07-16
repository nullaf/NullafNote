import React from "react";
import "./Note.scss";
import Link from "@material-ui/core/Link";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import firebase from "./firebase";

function File(props) {
  let deleteAudio = new Audio("/remove.wav");

  const onDeleteFile = () => {
    const queryData = firebase
      .firestore()
      .collection("keys")
      .doc(props.keyState)
      .collection("userFiles")
      .where("fileName", "==", props.fileName);
    queryData.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
    let storage = firebase.storage();
    let storageRef = storage.ref();
    let desertRef = storageRef
      .child(props.keyState + "/" + props.fileName)
      .delete();
    desertRef
      .then(() => {
        deleteAudio.play();
      })
      .catch((err) => {
        alert(err);
      });
  };
  return (
    <div className="File">
      <Link href={props.downloadUrl} target="_blank" rel="noopener noreferrer">
        {props.fileName}
      </Link>
      <IconButton onClick={onDeleteFile}>
        <DeleteIcon color="secondary" />
      </IconButton>
    </div>
  );
}

export default File;
