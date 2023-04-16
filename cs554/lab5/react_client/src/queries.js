import {gql} from '@apollo/client';

const GET_LOCATIONS = gql`
  query {
    locations: locationPosts {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
 `;


const GET_LIKE_LOCATIONS = gql`
  query {
    locations: likeLocations {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
 `;

const GET_USER_LOCATIONS = gql`
  query {
    locations: userPostedLocations {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
 `;

const GET_LOCATION = gql`
  query ($id: ID!) {
    location(id: $id) {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
 `;

const ADD_LOCATION = gql`
    mutation uploadLocation($image: String!, $address: String, $name: String) {
      uploadLocation(image: $image, address: $address, name: $name) {
        id
        image
        name
        address
        userPosted
        liked
      }
    }
`;

const ADD_PLACE_LOCATION = gql`
    mutation addPlaceToCache($id: ID!, $image: String!, $address: String!, $name: String!) {
      addPlaceToCache(id: $id, image: $image, address: $address, name: $name) {
        id
        image
        name
        address
        userPosted
        liked
      }
    }
`;

const UPDATE_LOCATION = gql`
    mutation updateLocation($id: ID!, $image: String, $name: String, $address: String, $userPosted: Boolean, $liked: Boolean) {
      location: updateLocation(id: $id, image: $image, name: $name, address: $address, userPosted: $userPosted, liked: $liked) {
        id
        image
        name
        address
        userPosted
        liked
      }
    }
`;


const DELETE_LOCATION = gql`
    mutation deleteLocation($id: ID!) {
      deleteLocation(id: $id) {
        id
        image
        name
        address
        userPosted
        liked
      }
    }
`;

const queries = {
    GET_LOCATIONS,
    GET_LIKE_LOCATIONS,
    GET_USER_LOCATIONS,
    GET_LOCATION,
    ADD_LOCATION,
    ADD_PLACE_LOCATION,
    UPDATE_LOCATION,
    DELETE_LOCATION
}

export default queries;