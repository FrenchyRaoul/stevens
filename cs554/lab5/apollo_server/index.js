const {ApolloServer, gql} = require('apollo-server');
const lodash = require('lodash');
const uuid = require('uuid');

const dummyLocations = [
    {
        id: "12345",
        image: "image_of_colchester.png",
        name: "colchester",
        address: "vermont",
        userPosted: true,
        liked: true,
    },
    {
        id: "54321",
        image: "imageOfNY.jpg",
        name: "new york",
        address: "new york",
        userPosted: false,
        liked: true,
    }
]

const typeDefs = gql`

type Query {
  locations: [Location]
  location(id: ID!): Location
}

type Location {
  id: ID!
  image: String
  name: String
  address: String
  userPosted: Boolean
  liked: Boolean
}

type Mutation {
  uploadLocation(image: String!, address: String, name: String): Location
  updateLocation(id: ID!, image: String, name: String, address: String, userPosted: Boolean, liked: Boolean): Location
  deleteLocation(id: ID!): Location
}
`

const resolvers = {
    Query:{
        locations: () => dummyLocations,
        location: (_, args) => dummyLocations.filter((loc) => loc.id === args.id)[0]
    },
    Location:{
        id: (parentValue) => {
            console.log(`parentValue in Location`, parentValue)
            return parentValue.id
        },
        image: (parentValue) => parentValue.image,
        name: (parentValue) => parentValue.name,
        address: (parentValue) => parentValue.address,
        userPosted: (parentValue) => parentValue.userPosted,
        liked: (parentValue) => parentValue.liked,
    },

    Mutation: {
        uploadLocation: (_, args) => {
            const newLocation = {
                id: uuid.v4(),
                image: args.image,
                name: args.name,
                address: args.address,
                userPosted: true,
                liked: false,
            }
            dummyLocations.push(newLocation)
            return newLocation
        },

        updateLocation: (_, args) => {
            console.log(`updating location with args: `, args)
            const objIndex = lodash.findIndex(dummyLocations, (loc) => loc.id === args.id)
            lodash.update(dummyLocations, objIndex, (old) => {
                console.log(`old: `, old)
                console.log(args)
                if (args.image) {
                    old.image = args.image
                }
                if (args.name) {
                    old.name = args.name
                }
                if (args.address) {
                    old.address = args.address
                }
                if (args.userPosted !== undefined) {
                    old.userPosted = args.userPosted
                }
                if (args.liked !== undefined) {
                    old.liked = args.liked
                }
                return old
            })
            return dummyLocations[objIndex]

        },

        deleteLocation: (_, args) => {
            console.log(args);
            return lodash.remove(dummyLocations, (loc) => loc.id === args.id)[0];
        }

    }
}

const server = new ApolloServer( {typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`apollo server ready at ${url}`)
})