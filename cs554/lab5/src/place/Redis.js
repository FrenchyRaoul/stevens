import { createClient } from 'redis';

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

function uploadLocation(image, address, name) {
    // This mutation will create a Location and will be saved in Redis. Outside of the provided values from the
    // “New Location” form, by default, the following values of Location should be:
    // liked: false
    // userPosted: true
    // id: a uuid
}

function updateLocation(id, image, name, address, userPosted, visited) {
    // This mutation will take care of any updates that we want to perform on a particular Location
    // If this location was not previously in the cache, and the user liked it, then add it to the cache using data from React state.
    // If an image post that came from the Places API and was unliked (liked set to false), you should also remove it from the cache.
}

function deleteLocation(id) {
    // Delete a user-posted Location from the cache.
}

export {
    uploadLocation, updateLocation, deleteLocation
}