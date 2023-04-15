import React, {useState} from 'react';
import {useQuery} from '@apollo/client';

import './App.css';
import queries from '../queries';

import AddLocationModal from "./modals/AddLocationModal";
import DeleteLocationModal from "./modals/DeleteLocationModal";
import EditLocationModal from "./modals/EditLocationModal";

function Locations() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [addLocation, setAddLocation] = useState(null);
    const [editLocation, setEditLocation] = useState(null);
    const [deleteLocation, setDeleteLocation] = useState(null)

    const {loading, error, data} = useQuery(queries.GET_LOCATIONS, {fetchPolicy: 'cache-and-network'})

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

    // const toggleLikeLocation = (location) => {
    //     const {
    //         _like_loading,
    //         _like_error,
    //         _location
    //     } = useQuery(queries.UPDATE_LOCATION, {fetchPolicy: 'cache-and-network'})
    // }

    if (data) {
        const {locations} = data;

        return (
            <div>
                <div>
                    <button className="button" onClick={handleOpenAddModal}>Create Location</button>
                    <br/>
                    <br/>
                    {locations.map((location) => {
                        return (
                            <div className="card" key={location.id}>
                                <div className="card-body">
                                    <h5 className="card-title">{location.name}</h5>
                                    <p>{location.address}</p>
                                    <p>{location.image}</p>
                                    <br/>
                                    <button className="button">Like!</button>
                                    <button className="button" onClick={() => handleOpenEditModal(location)}>Edit</button>
                                    <button className="button" onClick={() => handleOpenDeleteModal(location)}>Delete</button>
                                    <br/>
                                </div>
                            </div>
                        )
                    })}
                    <br/>
                </div>
                {showAddModal && (
                    <AddLocationModal isOpen={showAddModal} handleClose={handleCloseModals} addLocation={addLocation}></AddLocationModal>
                )}
                {showEditModal && (
                    <EditLocationModal isOpen={showEditModal} handleClose={handleCloseModals} editLocation={editLocation}></EditLocationModal>
                )}
                {showDeleteModal && (
                    <DeleteLocationModal isOpen={showDeleteModal} handleClose={handleCloseModals} deleteLocation={deleteLocation}></DeleteLocationModal>
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