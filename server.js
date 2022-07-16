const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const { GraphQLSchema ,
        GraphQLObjectType,
        GraphQLString,
        GraphQLList,
        GraphQLNonNull,
        GraphQLInt
    } = require("graphql");

const app = express();

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const AuthorType = new GraphQLObjectType({
    name:"author",
    description:"get a author with some others",
    fields:() =>({
        id:{
            type:GraphQLNonNull(GraphQLInt),
            deprecationReason:"id of the books"
        },
        name:{
            type:GraphQLNonNull(GraphQLString)
        },
        books :{
            type : new GraphQLList(booksType),
            resolve : (author) =>{
                return books.filter(book =>  book.authorId === author.id)
            }
        }
    })
})


const booksType = new GraphQLObjectType({
    name:"Book",
    description:"get a book with some others",
    fields:() =>({
        id:{
            type:GraphQLNonNull(GraphQLInt),
            deprecationReason:"id of the books"
        },
        name:{
            type:GraphQLNonNull(GraphQLString)
        },
        authorId:{
            type:GraphQLNonNull(GraphQLInt)
        },
        author:{
            type : AuthorType,
            resolve: (book) =>{
                return authors.find(author => author.id === book.authorId );
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name:"Query",
    description:"Root query",
    fields:() =>({
        books:{
            type:new GraphQLList (booksType),
            description:"All the books",
            resolve:() => books     
        },
    })
})
const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use("/graphql",graphqlHTTP({
    schema:schema,
    graphiql:true
}))
app.listen(5000,console.log("app is listening in port 5000"));
