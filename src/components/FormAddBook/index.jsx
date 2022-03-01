import { gql, useMutation, useQuery } from "@apollo/client";
import { Formik } from "formik";
import { useRef } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import * as yup from "yup";
import { AddBook, singleUploadFile } from "../graphql-client/mutations";
import { getAuthors } from "../graphql-client/queries";
import LoadingAndShowAlert from "../Loading";

const FormAddBook = () => {
  const { loading, data } = useQuery(getAuthors);
  const fileRef = useRef();
  const [AddBookQuery, addBookMutation] = useMutation(AddBook);
  console.log(addBookMutation);
  const [singleUploadFileQuery, singleUploadFileMutation] =
    useMutation(singleUploadFile);
  const schema = yup.object().shape({
    name: yup.string().required("* Name is a required field"),
    genre: yup.string().required("* Genre is a required field"),
    imageUrl: yup.mixed().required("* Image is a required field"),
    authorId: yup.string().required("* Author is a required field"),
  });

  const handleSubmitFormAddBook = async (values, resetForm) => {
    const fileImageUrl = await singleUploadFileQuery({
      variables: { file: values.imageUrl },
    });
    const newBook = {
      ...values,
      imageUrl: fileImageUrl.data.singleUploadFile.url,
    };
    AddBookQuery({
      variables: newBook,
      /* refetchQueries: [{query: getBooks}] */
      update(cache, { data: createBook }) {
        try {
          const query = gql`
            query getBooksQuery {
              books {
                id
                name
                imageUrl
              }
            }
          `;
          const data = cache.readQuery({ query });
          console.log(data);
          console.log(createBook);
          cache.writeQuery({
            query,
            data: { books: [...data.books, createBook.createBook] },
          });
        } catch (error) {
          console.log(error);
        }
      },
    });
    resetForm();
    fileRef.current.value = "";
  };

  return (
    <>
      <LoadingAndShowAlert
        isLoading={addBookMutation.loading || singleUploadFileMutation.loading}
        isError={addBookMutation.error || singleUploadFileMutation.error}
        isCalled={addBookMutation.called || singleUploadFileMutation.called}
      />
      <Formik
        onSubmit={(values, { resetForm, setFieldValue }) =>
          handleSubmitFormAddBook(values, resetForm, setFieldValue)
        }
        initialValues={{
          name: "",
          genre: "",
          imageUrl: "",
          authorId: "",
        }}
        validationSchema={schema}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          values,
          touched,
          errors,
          isValid,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
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
              <Form.Control
                className="text-info"
                id="image"
                ref={fileRef}
                name="imageUrl"
                accept=".jpg,.png"
                type="file"
                defaultValue={values.imageUrl}
                onChange={(e) => setFieldValue("imageUrl", e.target.files[0])}
                onBlur={handleBlur}
                isInvalid={touched.imageUrl && errors.imageUrl}
              />
              {console.log(errors)}
              <Form.Control.Feedback type="invalid">
                {errors.imageUrl}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              {loading ? (
                <Spinner animation="border" variant="primary"></Spinner>
              ) : (
                <>
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
                    {data.authors.map((authorId) => (
                      <option key={authorId.id} value={authorId.id}>
                        {authorId.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.authorId}
                  </Form.Control.Feedback>
                </>
              )}
            </Form.Group>
            <Button className="float-end" variant="outline-info" type="submit">
              Add Book
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormAddBook;
