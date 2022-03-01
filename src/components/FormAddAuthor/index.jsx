import React from "react";
import { Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { AddAuthor } from "../graphql-client/mutations";
import LoadingAndShowAlert from "../Loading";

const FormAddAuthor = () => {
  const [AddAuthorQuery, addAuthorMutation] = useMutation(AddAuthor);
  const schema = yup.object().shape({
    name: yup.string().required("* Name is required field."),
    age: yup
      .number("* Age must be number")
      .positive("* Age must be positive")
      .integer("* Age must be integer")
      .required("* Age is required field."),
  });
  const handleSubmitFormAddAuthor = (values, resetForm) => {
    AddAuthorQuery({
      variables: values,
      update(cache, { data: createAuthor }) {
        try {
          const query = gql`
            query getAuthorsQuery {
              authors {
                id
                name
              }
            }
          `;
          const data = cache.readQuery({ query });
          const myNewAuthor = { ...createAuthor.createAuthor };
          cache.writeQuery({
            query,
            data: { authors: [...data.authors, myNewAuthor] },
          });
        } catch (error) {
          console.log(error);
        }
      },
    });
    resetForm({ values: "" });
  };

  return (
    <>
      <LoadingAndShowAlert
        isCalled={addAuthorMutation.called}
        isLoading={addAuthorMutation.loading}
        isError={addAuthorMutation.error}
      />
      <Formik
        onSubmit={(values, { resetForm }) =>
          handleSubmitFormAddAuthor(values, resetForm)
        }
        initialValues={{ name: "", age: "" }}
        validationSchema={schema}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                name="name"
                type="text"
                placeholder="Author Name..."
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.name && errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                name="age"
                type="number"
                value={values.age}
                min={1}
                placeholder="Author Age..."
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.age && errors.age}
              />
              <Form.Control.Feedback type="invalid">
                {errors.age}
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="float-end" variant="outline-info" type="submit">
              Add Author
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormAddAuthor;
