import './App.css';
import Container from 'react-bootstrap/Container';
import BookList from './components/BookList';
import { Col, Row } from 'react-bootstrap';
import FormAddBook from './components/FormAddBook';
import FormAddAuthor from './components/FormAddAuthor';
import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { ReactNotifications } from 'react-notifications-component';

const link = ApolloLink.from([
  createUploadLink({
    uri: "https://book-app-ngo-hop.herokuapp.com/graphql"
  })
]);

const client = new ApolloClient({
  uri: 'https://book-app-ngo-hop.herokuapp.com/graphql',
  cache: new InMemoryCache(),
  link: link
})

function App() {
  return (
    <ApolloProvider client={client}>
      {console.log("app")}
      <Container className='py-3 mt-3' style={{ backgroundColor: 'lightcyan' }}>
      <ReactNotifications />
        <h1 className='text-center text-info font-weight-bold mb-3'>My Books</h1>
        <hr />
        <Row>
          <Col xs={6}>
            <FormAddBook />
          </Col>
          <Col xs={6}>
            <FormAddAuthor />
          </Col>
        </Row>
        <hr />
        <BookList />
      </Container>
    </ApolloProvider>
  );
}

export default App;
