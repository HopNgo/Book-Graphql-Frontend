import { gql } from '@apollo/client';


export const AddBook = gql`
    mutation AddBookQuery($name: String!, $genre: String!, $imageUrl: String!, $authorId: ID!){
        createBook(name: $name, genre: $genre, imageUrl: $imageUrl, authorId: $authorId){
          id
          name
          imageUrl
        }
    }
`
export const AddAuthor= gql`
    mutation AddAuthorQuery($name: String!, $age: Int!){
        createAuthor(name: $name, age: $age){
          id
          name
        }
    }
`
export const singleUploadFile = gql`
    mutation singleUploadFileQuery($file: Upload!){
        singleUploadFile(file : $file){
          url
        }
    }
`
export const deleteBook = gql`
  mutation deleteBookQuery($id: ID!){
    deleteBook(id: $id){
      id
    }
  }
`
export const editBook = gql`
  mutation editBookQuery($id: ID!, $name: String!, $genre: String!, $imageUrl: String!, $authorId: ID!){
    editBook(id: $id, name: $name, genre: $genre, imageUrl: $imageUrl, authorId: $authorId){
      id
      name
      genre
      imageUrl
      author{
        id
        name
        age
      }
    }
  }
`