import { Card, Row, Col, Spinner } from "react-bootstrap";
import BookDetail from "../BookDetail";
import { useQuery } from "@apollo/client";
import { getBooks } from "../graphql-client/queries";
import { useState } from "react";

const BookList = () => {
  console.log("re-rerender-book-list");
  const [bookId, setBookId] = useState(null);
  const { loading, error, data } = useQuery(getBooks);
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  if (error) {
    return <p>Error Loading Books </p>;
  }
  console.log(data);
  return (
    <Row>
      <Col xs={8}>
        {data.books.map((book) => (
          <Card
            onClick={() => setBookId(book.id)}
            key={book.id}
            style={{
              display: "inline-block",
              marginLeft: "1.2rem",
              marginBottom: "1rem",
              cursor: "pointer",
            }}
            border="info"
            text="info"
            className="text-center shadow p-3"
          >
            <Card.Img
              variant="top"
              src={book.imageUrl}
              style={{
                maxWidth: "10rem",
                minWidth: "10rem",
                maxHeight: "13rem",
                minHeight: "13rem",
                objectFit: "cover",
              }}
            ></Card.Img>
            <Card.Text style={{ fontWeight: "bold", marginTop: "1rem" }}>
              {book.name}
            </Card.Text>
          </Card>
        ))}
      </Col>
      <Col>
        <BookDetail
          bookId={
            data.books.findIndex((book) => book.id === bookId) >= 0
              ? bookId
              : null
          }
        />
      </Col>
    </Row>
  );
};

export default BookList;
