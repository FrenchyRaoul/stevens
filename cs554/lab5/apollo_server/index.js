require('dotenv').config();

const {ApolloServer, gql} = require('apollo-server');
const lodash = require('lodash');
const uuid = require('uuid');

const {getFormattedPlaces} = require('./Places');
const {uploadLocation, getLikedLocations, getUserLocations, getLocation, deleteLocation, getCachedIds} = require('./Redis')

const PAGE_SIZE = 2;


const typeDefs = gql`

type Query {
  locationPosts: [Location]
  likeLocations: [Location]
  userPostedLocations: [Location]
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
  addPlaceToCache(id: ID!, image: String, name: String, address: String): Location
  updateLocation(id: ID!, image: String, name: String, address: String, userPosted: Boolean, liked: Boolean): Location
  toggleLikeLocation(id: ID!): Location
  deleteLocation(id: ID!): Location
}
`

const resolvers = {
    Query:{
        locationPosts: async () => {
            const places = await getFormattedPlaces({limit: PAGE_SIZE});
            const cacheKeys = await getCachedIds();
            return places.map(async (placePromise)=>{
                const place = await placePromise;
                if (cacheKeys.includes(place.id)) {
                    console.log(`found one`, place);
                    return {
                        ...place,
                        liked: true
                    }
                } else {
                    console.log(`did not find key`, place.id)
                    return place
                }
            })
        },
        likeLocations: async () => {return await getLikedLocations()},
        userPostedLocations: async () => {return await getUserLocations()},
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
        uploadLocation: async (_, args) => {
            console.log(`uploading loc with args: `, args)
            const newLocation = {
                id: uuid.v4(),
                image: args.image,
                name: args.name,
                address: args.address,
                userPosted: true,
                liked: false,
            }
            await uploadLocation(newLocation)
            console.log(`returning obj: `, newLocation)
            return newLocation
        },

        addPlaceToCache: async (_, args) => {
            console.log(`uploading loc with args: `, args)
            const newLocation = {
                id: args.id,
                image: args.image,
                name: args.name,
                address: args.address,
                userPosted: false,
                liked: true,
            }
            await uploadLocation(newLocation)
            return newLocation
        },

        updateLocation: async (_, args) => {
            console.log(`updating location with args: `, args)
            const old = await getLocation(args.id);
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
            await uploadLocation(old)
            return old
        },

        deleteLocation: async (_, args) => {
            console.log(args);
            return await deleteLocation(args.id);
        }

    }
}

const server = new ApolloServer( {typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`apollo server ready at ${url}`)
})