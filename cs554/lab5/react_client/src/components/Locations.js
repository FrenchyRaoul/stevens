import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';

import './App.css';
import queries from '../queries';

import noImg from '../img/no_img.png';

import AddLocationModal from "./modals/AddLocationModal";
import DeleteLocationModal from "./modals/DeleteLocationModal";
import EditLocationModal from "./modals/EditLocationModal";

function toggleLike(updateFunc, location) {
    console.log("running toggle like function!")
    updateFunc({
        variables:{
            id: location.id,
            liked: !location.liked,
        }
    });
}

function uploadAndLike(uploadMutation, deleteMutation, location) {
    console.log("running upload and like function!")
    if (!location.liked) {
        console.log("uploading location")
        uploadMutation({
            variables:{
                ...location,
                liked: true,
            }
        })
    }
    else {
        console.log("deleting location")
        deleteMutation({
            variables:{
                id: location.id
            }
        })
    }
}


// function clearLikeCache(cache) {
//     const {locations} = cache.readQuery({query: props.query});
//     cache.writeQuery({
//             query: props.query,
//             data: { locations: locations.filter((loc)=>loc.liked) }
//         }
//     )
// }
//

function LocationCard(props) {
    const {location, editFunc, deleteFunc} = props;

    const [updateLocation] = useMutation(queries.UPDATE_LOCATION, {
        update(cache, {data: {updateLocation}}) {
            if (props.query === queries.GET_LIKE_LOCATIONS) {
                const {locations} = cache.readQuery({query: props.query});
                cache.writeQuery({
                        query: props.query,
                        data: { locations: locations.filter((loc)=>loc.liked) }
                    }
                )
            }
        }
    });
    const [addLocation] = useMutation(queries.ADD_PLACE_LOCATION);
    const [deleteLocation] = useMutation(queries.DELETE_LOCATION, {
        update(cache, {data: {deleteLocation}}) {
            if (props.query !== queries.GET_LOCATIONS) {
                const {locations} = cache.readQuery({query: props.query});
                cache.writeQuery({
                        query: props.query,
                        data: { locations: locations.filter((loc)=>loc.id !== deleteLocation.id) }
                    }
                )
            }

            const result = cache.readQuery({query: queries.GET_LOCATIONS});
            if (result && result['locations']) {
                const filtered = result['locations'].map((loc)=>{
                    if (loc.id === deleteLocation.id) return {...deleteLocation, liked: false};
                    return loc
                });
                cache.writeQuery({
                        query: queries.GET_LOCATIONS,
                        data: { locations: filtered}
                    }
                )
            }
        }
    });

    const [image, setImage] = useState(location.image)
    useEffect(()=> {
        async function checkImage() {
            try {
                require(location.image);
            } catch {
                setImage(noImg)
            }
        }
        checkImage();
    })

    const likeFunc = location.userPosted ?
        ()=>toggleLike(updateLocation, location) :
        ()=>uploadAndLike(addLocation, deleteLocation, location);

    const likeButton = (
        <button className='button' onClick={likeFunc}>
            {location.liked ? "Unlike!" : "Like!"}
        </button>
    )

    return (
        <div className="card" key={location.id}>
            <img className="loc-img card-img-top"
                 src={location.image}
                 onError={({ currentTarget }) => {
                     currentTarget.onerror = null; // prevents looping
                     currentTarget.src=noImg;
                 }} alt="image of location" />
            <div className="card-body">
                <h5 className="card-title">{location.name}</h5>
                <p>{location.address}</p>
                <br/>
                {likeButton}
                {(location.userPosted) &&
                    <button className="button" onClick={() => editFunc(location)}>Edit</button>}
                {(location.userPosted) &&
                    <button className="button" onClick={() => deleteFunc(location)}>Delete</button>}
                <br/>
            </div>
        </div>
    )
}

function Locations(props) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [addLocation, setAddLocation] = useState(null);
    const [editLocation, setEditLocation] = useState(null);
    const [deleteLocation, setDeleteLocation] = useState(null)

    const {loading, error, data} = useQuery(props.query, {fetchPolicy: 'cache-and-network'})


    const handleOpenEditModal = (location) => {
        setShowEditModal(true);
        setEditLocation(location);
    }

    const handleOpenDeleteModal = (location) => {
        setShowDeleteModal(true);
        setDeleteLocation(location);
    }

    const handleOpenAddModal = (location) => {
        setShowAddModal(true);
        setAddLocation(location);
    }

    const handleCloseModals = () => {
        setShowAddModal(false);
        setShowDeleteModal(false);
        setShowEditModal(false);
    }

    if (data) {
        const {locations} = data;

        return (
            <div>
                <div>
                    <button className="button" onClick={handleOpenAddModal}>Create Location</button>
                    <br/>
                    <br/>
                    {locations.map((location) => {
                        return <LocationCard
                            location={location}
                            editFunc={handleOpenEditModal}
                            deleteFunc={handleOpenDeleteModal}
                            query={props.query}
                        />
                    })}
                    <br/>
                </div>
                {showAddModal && (
                    <AddLocationModal
                        isOpen={showAddModal}
                        handleClose={handleCloseModals}
                        addLocation={addLocation}
                        query={props.query}
                    ></AddLocationModal>
                )}
                {showEditModal && (
                    <EditLocationModal
                        isOpen={showEditModal}
                        handleClose={handleCloseModals}
                        editLocation={editLocation}
                        query={props.query}
                    ></EditLocationModal>
                )}
                {showDeleteModal && (
                    <DeleteLocationModal
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteLocation={deleteLocation}
                        query={props.query}
                    ></DeleteLocationModal>
                )}
            </div>
        )
    } else if (loading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>{error}</div>
    }
}

export default Locations;