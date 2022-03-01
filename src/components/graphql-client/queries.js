import { gql } from '@apollo/client';


export const getBooks = gql`
    query getBooksQuery{
        books{
            id
            name
            imageUrl
        }
    }
`
export const getSingleBook = gql`
    query getSingleBookQuery($id: ID){
        book(id: $id){
            id
            name
            imageUrl
            genre
            author{
                id
                name
                age
                books{
                    id
                    name
                }
            }
        }
    }
`
export const getAuthors = gql`
    query getAuthorsQuery{
        authors{
            id
            name
        }
    }
`


