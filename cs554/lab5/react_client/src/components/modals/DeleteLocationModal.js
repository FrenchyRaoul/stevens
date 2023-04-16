import React, {useState} from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import {useMutation} from '@apollo/client';

import queries from '../../queries';

// For React-modal
ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        border: '1px solid #28547a',
        borderRadius: '4px',
    }
}


function DeleteLocationModal(props) {
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [location, setLocation] = useState(props.deleteLocation);

    const [deleteLocation] = useMutation(queries.DELETE_LOCATION, {
        update(cache, {data: {deleteLocation}}) {
            const {locations} = cache.readQuery({query: props.query});
            cache.writeQuery({
                    query: props.query,
                    data: { locations: locations.filter((loc)=>loc.id !== deleteLocation.id) }
                }
            )
        }
    });

    const handleCloseDeleteModal = ()=>{
        setShowDeleteModal(false);
        setLocation(null);
        props.handleClose();
    };

    return (
        <div>
            <ReactModal
                name='deleteModal'
                isOpen={showDeleteModal}
                contentLabel="Delete Location"
                style={customStyles}>
                <div>
                    <p>
                        Are you sure you want to delete {location.name} ({location.address})?
                    </p>
                    <form className='form' id='delete-location' onSubmit={(e)=>{
                        e.preventDefault();
                        deleteLocation({
                            variables:{
                                id: location.id
                            },
                        })
                        setShowDeleteModal(false);
                        alert("Location deleted!");
                        props.handleClose()
                    }}>
                        <br />
                        <br />
                        <button className="button add-button" type="submit">Delete Location</button>
                    </form>
                    <button className='button cancel-button' onClick={handleCloseDeleteModal}>Cancel</button>
                </div>
            </ReactModal>
        </div>
    )


}

export default DeleteLocationModal;