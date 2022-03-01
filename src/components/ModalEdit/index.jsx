import { useMutation, useQuery } from "@apollo/client";
import { Formik } from "formik";
import React from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import * as yup from "yup";
import { editBook, singleUploadFile } from "../graphql-client/mutations";
import { getAuthors, getSingleBook } from "../graphql-client/queries";
import LoadingAndShowAlert from "../Loading";

const ModalEdit = ({ show, handleClose, bookId }) => {
  console.log("re-render-modal-edit");
  const authors = useQuery(getAuthors);
  const [singleUploadFileQuery] = useMutation(singleUploadFile);
  const [editBookQuery, editBookMutation] = useMutation(editBook);
  const singleBook = useQuery(getSingleBook, {
    variables: {
      id: bookId,
    },
  });

  const schema = yup.object().shape({
    name: yup.string().required("* Name is a required field"),
    genre: yup.string().required("* Genre is a required field"),
    imageUrl: yup.mixed().required("* Image is a required field"),
    authorId: yup.string().required("* Author is a required field"),
  });

  const handleSubmitFormEditBook = async (values) => {
    const fileImageUrlEditted = await singleUploadFileQuery({
      variables: { file: values.imageUrl },
    });
    const newBookEditted = {
      ...values,
      id: bookId,
      imageUrl: fileImageUrlEditted.data.singleUploadFile.url,
    };
    editBookQuery({
      variables: newBookEditted,
      refetchQueries: [{ query: getSingleBook, variables: { id: bookId } }],
    });
  };

  return (
    <>
      <LoadingAndShowAlert
        isCalled={editBookMutation.called}
        isLoading={editBookMutation.loading}
        isError={editBookMutation.error}
      />
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Edit Book Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            onSubmit={(values) => handleSubmitFormEditBook(values)}
            initialValues={{
              name: singleBook.data.book ? singleBook.data.book.name : "",
              genre: singleBook.data.book ? singleBook.data.book.genre : "",
              imageUrl: "",
              authorId: singleBook.data.book
                ? singleBook.data.book.author.id
                : "",
            }}
            validationSchema={schema}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
              isValid,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit} onChange={console.log(touched)}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-info">Book Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Book Name..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    isInvalid={touched.name && errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-info">Book Genre</Form.Label>
                  <Form.Control
                    name="genre"
                    type="text"
                    value={values.genre}
                    placeholder="Book Genre..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.genre && errors.genre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.genre}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-info">Image URL</Form.Label>
                  <Form.Control
                    name="imageUrl"
                    type="file"
                    defaultValue={values.imageUrl}
                    onChange={(e) =>
                      setFieldValue("imageUrl", e.target.files[0])
                    }
                    onBlur={handleBlur}
                    isInvalid={touched.imageUrl && errors.imageUrl}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.imageUrl}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-info">Book Author</Form.Label>
                  {authors.loading ? (
                    <Spinner animation="border" variant="primary"></Spinner>
                  ) : (
                    <>
                      {console.log(Object.keys(errors).length)}
                      <Form.Control
                        as="select"
                        name="authorId"
                        value={values.authorId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.authorId && errors.authorId}
                      >
                        <option disabled value="">
                          Select Author
                        </option>
                        {authors.data.authors.map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.authorId}
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>
                <Button
                  style={{ marginLeft: "1rem" }}
                  className="float-end px-4 py-2"
                  variant="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  className="float-end text-white px-4 py-2"
                  variant="info"
                  type="submit"
                  onClick={
                    Object.keys(errors).length === 0 &&
                    Object.keys(touched).length > 0
                      ? handleClose
                      : undefined
                  }
                >
                  Edit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default React.memo(ModalEdit);
