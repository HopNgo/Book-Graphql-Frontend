import { gql, useMutation, useQuery } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { deleteBook } from "../graphql-client/mutations";
import { getSingleBook } from "../graphql-client/queries";
import ModalDelete from "../ModalDelete";
import ModalEdit from "../ModalEdit";

const BookDetail = ({ bookId }) => {
  console.log("re-render-book-detail");
  console.log(bookId);
  const { loading, error, data } = useQuery(getSingleBook, {
    variables: {
      id: bookId,
    },
  });
  const [deleteBookQuery] = useMutation(deleteBook);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (bookId !== null && error) return <p>Error loading book detail ...</p>;

  const handleDeleteBook = () => {
    deleteBookQuery({
      variables: {
        id: bookId,
      },
      update(cache, { data: deleteBook }) {
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
          console.log(deleteBook.deleteBook);
          cache.writeQuery({
            query,
            data: {
              books: data.books.filter(
                (book) => book.id !== deleteBook.deleteBook.id
              ),
            },
          });
        } catch (error) {
          console.log(error);
        }
      },
    });
    setShowModalDelete(false);
  };
  return (
    <>
      <ModalDelete
        show={showModalDelete}
        handleClose={() => setShowModalDelete(false)}
        handleDelete={handleDeleteBook}
      />
      <ModalEdit
        show={showModalEdit}
        handleClose={() => setShowModalEdit(false)}
        bookId={bookId}
      />
      <Card
        bg="info"
        text="white"
        className="shadow"
        style={{ minHeight: "40rem" }}
      >
        {data.book === null ? (
          <Card.Text className="text-center mt-2 lead">
            Please choose a book
          </Card.Text>
        ) : (
          <>
            <DeleteIcon
              onClick={() => setShowModalDelete(true)}
              className="text-white"
              style={{
                fontSize: "2rem",
                position: "absolute",
                top: "31rem",
                right: "1rem",
                cursor: "pointer",
              }}
            />
            <EditIcon
              className="text-white"
              onClick={() => setShowModalEdit(true)}
              style={{
                fontSize: "2rem",
                position: "absolute",
                top: "31rem",
                right: "4rem",
                cursor: "pointer",
              }}
            />
            <Card.Img
              variant="top"
              src={data && data.book.imageUrl}
              style={{
                maxWidth: "25.85rem",
                minWidth: "25.85rem",
                maxHeight: "30rem",
                minHeight: "30rem",
              }}
            />
            <Card.Body>
              <Card.Title style={{ fontSize: "1.6rem" }}>
                {data && data.book.name}
              </Card.Title>
              <Card.Subtitle>Genre: {data && data.book.genre}</Card.Subtitle>
              <p>Author: {data && data.book.author.name} </p>
              <p>Age: {data && data.book.author.age}</p>
              <p>
                All Books By This Author:
                <strong>{data && data.book.author.name}</strong>
              </p>
              <ul>
                {data &&
                  data.book.author.books.map((book) => (
                    <li key={book.id}>{book.name}</li>
                  ))}
              </ul>
            </Card.Body>
          </>
        )}
      </Card>
    </>
  );
};

export default BookDetail;
