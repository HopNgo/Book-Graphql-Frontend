import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalDelete = ({ show, handleClose, handleDelete }) => {
  console.log("rerender-modal-delete");
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Book ?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure to want to delete this book ?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(ModalDelete);
