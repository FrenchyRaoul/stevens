import {gql} from '@apollo/client';

const GET_LOCATIONS = gql`
  query {
    locations {
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

const UPDATE_LOCATION = gql`
    mutation updateLocation($id: ID!, $image: String, $name: String, $address: String, $userPosted: Boolean, $liked: Boolean) {
      updateLocation(id: $id, image: $image, name: $name, address: $address, userPosted: $userPosted, liked: $liked) {
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
    GET_LOCATION,
    ADD_LOCATION,
    UPDATE_LOCATION,
    DELETE_LOCATION
}

export default queries;