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

    // const {loading, error, data} = useQuery(queries.GET_LOCATIONS);

    const [updateLocation] = useMutation(queries.UPDATE_LOCATION);

    const handleCloseEditModal = ()=>{
        setShowEditModal(false);
        setLocation(null);
        props.handleClose();
    };

    let image;
    let address;
    let name;
    let userPosted;
    let liked;

    const body = (
        <form className="form" id="edit-location" onSubmit={(e) =>{
            e.preventDefault();
            updateLocation({
                variables:{
                    id: location.id,
                    image: image.value,
                    address: address.value,
                    name: name.value,
                    userPosted: userPosted.checked, // userPosted.value,
                    liked: liked.checked, //liked.value
                }
            });
            image.value = '';
            address.value = '';
            name.value = '';
            userPosted.checked = false;
            liked.checked = false;
            setShowEditModal(false);
            alert("Location updated!");
            props.handleClose()
        }}>
            <div className="form-group">
                <label>Image
                    <br />
                    <input
                        ref={(node)=>{
                            image = node;
                        }}
                        autoFocus={true}
                        defaultValue={location.image}
                    />
                </label>
            </div>
            <br />
            <div className="form-group">
                <label>Address
                    <br />
                    <input
                        ref={(node)=>{
                            address = node;
                        }}
                        defaultValue={location.address}
                    />
                </label>
            </div>
            <br />
            <div className="form-group">
                <label>Name
                    <br />
                    <input
                        ref={(node)=>{
                            name = node;
                        }}
                        defaultValue={location.name}
                    />
                </label>
            </div>
            <br />
            <div className="form-group">
                <label>Posted by User?
                    <br />
                    <input type="checkbox"
                           ref={(node)=>{
                               userPosted = node;
                           }}
                           defaultChecked={location.userPosted}
                    />
                </label>
            </div>
            <br />
            <div className="form-group">
                <label>Liked?
                    <br />
                    <input type="checkbox"
                           ref={(node)=>{
                               liked = node;
                           }}
                           defaultChecked={location.liked}
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