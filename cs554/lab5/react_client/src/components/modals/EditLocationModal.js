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

function EditLocationModal(props) {
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [location, setLocation] = useState(props.editLocation);

    const [updateLocation] = useMutation(queries.UPDATE_LOCATION);

    const handleCloseEditModal = ()=>{
        setShowEditModal(false);
        setLocation(null);
        props.handleClose();
    };

    let image;
    let address;
    let name;

    const body = (
        <form className="form w-100" id="edit-location" onSubmit={(e) =>{
            e.preventDefault();
            updateLocation({
                variables:{
                    id: location.id,
                    image: image.value,
                    address: address.value,
                    name: name.value,
                    userPosted: true, // userPosted.value,
                }
            });
            image.value = '';
            address.value = '';
            name.value = '';
            setShowEditModal(false);
            props.handleClose()
            alert("Location updated!");
        }}>
            <div className="form-group">
                <label className='w-100'>*Name
                    <br />
                    <input
                        className='w-100'
                        ref={(node)=>{
                            name = node;
                        }}
                        required
                        defaultValue={location.name}
                    />
                </label>
            </div>
            <br />
            <div className="form-group">
                <label className='w-100'>Address
                    <br />
                    <input
                        className='w-100'
                        ref={(node)=>{
                            address = node;
                        }}
                        defaultValue={location.address}
                    />
                </label>
            </div>
            <br />
            <div className="form-group">
                <label className='w-100'>Image (url to online image)
                    <br />
                    <input
                        className='w-100'
                        ref={(node)=>{
                            image = node;
                        }}
                        autoFocus={true}
                        defaultValue={location.image}
                    />
                </label>
            </div>
            <br />
            <br />
            <button className="button add-button" type='submit'>Edit Location</button>
        </form>
    )

    return (
        <div>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel="Edit Location"
                style={customStyles}>
                {body}
                <button className='button cancel-button' onClick={()=>handleCloseEditModal()}>Cancel</button>
            </ReactModal>
        </div>
    )


}

export default EditLocationModal;