import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';

import './App.css';
import queries from '../queries';

import noImg from '../img/no_img.png';

import AddLocationModal from "./modals/AddLocationModal";
import DeleteLocationModal from "./modals/DeleteLocationModal";
import EditLocationModal from "./modals/EditLocationModal";

function toggleLike(updateFunc, location) {
    updateFunc({
        variables:{
            id: location.id,
            liked: !location.liked,
        }
    });
}

function uploadAndLike(uploadMutation, deleteMutation, location) {
    if (!location.liked) {
        uploadMutation({
            variables:{
                ...location,
                liked: true,
            }
        })
    }
    else {
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
    const {location, editFunc, deleteFunc, currentPage} = props;

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

            const result = cache.readQuery({query: queries.GET_LOCATIONS, variables:{pageNum: currentPage}});
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


    const likeFunc = location.userPosted ?
        ()=>toggleLike(updateLocation, location) :
        ()=>uploadAndLike(addLocation, deleteLocation, location);

    const likeButton = (
        <button className={location.liked ? 'btn btn-danger mr-2' : 'btn btn-success mr-2'} onClick={likeFunc}>
            {location.liked ? "Remove like..." : "Like!"}
        </button>
    )

    return (
        <div className="col mb-5">
            <div className="card h-100 loc-card">
                <img className="loc-img card-img-top"
                     src={location.image}
                     onError={({ currentTarget }) => {
                         currentTarget.onerror = null; // prevents looping
                         currentTarget.src=noImg;
                     }} alt="location" />
                <div className="card-body">
                    <h5 className="card-title">{location.name}</h5>
                    <p>{location.address}</p>
                    <br/>
                </div>
                <div className="card-footer">
                    {likeButton}
                    {(location.userPosted) &&
                        <button className="btn btn-warning mr-2" onClick={() => editFunc(location)}>Edit</button>}
                    {(location.userPosted) &&
                        <button className="btn btn-danger mr-2" onClick={() => deleteFunc(location)}>Delete</button>}
                    <br/>
                </div>
            </div>
        </div>
    )
}

function Locations(props) {
    const [page, setPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [addLocation, setAddLocation] = useState(null);
    const [editLocation, setEditLocation] = useState(null);
    const [deleteLocation, setDeleteLocation] = useState(null)

    const {loading, error, data} = useQuery(props.query, {
        fetchPolicy: 'cache-and-network',
        variables: { pageNum: page }
    })


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
                    {(props.query === queries.GET_USER_LOCATIONS) ?
                        <div className="container">
                            <div className="row justify-content-md-center">
                                <div className="col col-lg-6 mt-5">
                                    <button className="btn btn-block btn-success" onClick={handleOpenAddModal}>Create Location</button>
                                </div>
                            </div>
                        </div>
                        : ""
                    }
                    <br/>
                    <br/>
                    <div className="row row-cols-1 row-cols-md-2 g-3">
                        {locations.map((location) => {
                            return <LocationCard
                                key={location.id}
                                location={location}
                                editFunc={handleOpenEditModal}
                                deleteFunc={handleOpenDeleteModal}
                                query={props.query}
                                currentPage={page}
                            />
                        })}
                    </div>
                    <br/>
                    {(props.query === queries.GET_LOCATIONS) ?
                        <div className="container">
                            <div className="row justify-content-md-center">
                                <div className="col col-lg-6 mb-5">
                                    <button className="btn btn-block btn-primary" onClick={()=>{setPage(page + 1)}}>Get More!</button>
                                </div>
                            </div>
                        </div>
                        :
                        ""
                    }

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