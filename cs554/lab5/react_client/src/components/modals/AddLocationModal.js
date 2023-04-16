import React, {useState} from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import {useQuery, useMutation} from '@apollo/client';

import queries from '../../queries';
import AddLocationForm from '../AddLocationForm'


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

function AddLocationModal(props) {
    const [showAddModal, setShowAddModal] = useState(props.isOpen)

    const [uploadLocation] = useMutation(queries.ADD_LOCATION, {
        update(cache, {data: {uploadLocation}}) {
            const {locations} = cache.readQuery({query: props.query});
            cache.writeQuery({
                    query: props.query,
                    data: {locations: locations.concat([uploadLocation])}
                }
            )
        }
    });

    const handleCloseAddModal = ()=>{
        setShowAddModal(false);
        props.handleClose();
    }

    // let image;
    // let address;
    // let name;

    // const body = (
    //     <form className="form" id="add-location" onSubmit={(e) =>{
    //         e.preventDefault();
    //         uploadLocation({
    //             variables:{
    //                 image: image.value,
    //                 address: address.value,
    //                 name: name.value,
    //             }
    //         });
    //         image.value = '';
    //         address.value = '';
    //         name.value = '';
    //         setShowAddModal(false);
    //         props.handleClose()
    //         alert("Location added!");
    //     }}>
    //         <div className="form-group">
    //             <label>Image
    //                 <br />
    //                 <input
    //                     ref={(node)=>{
    //                         image = node;
    //                     }}
    //                     required
    //                     autoFocus={true} />
    //             </label>
    //         </div>
    //         <br />
    //         <div className="form-group">
    //             <label>Address
    //                 <br />
    //                 <input
    //                     ref={(node)=>{
    //                         address = node;
    //                     }}
    //                     required/>
    //             </label>
    //         </div>
    //         <br />
    //         <div className="form-group">
    //             <label>Name
    //                 <br />
    //                 <input
    //                     ref={(node)=>{
    //                         name = node;
    //                     }}
    //                     required/>
    //             </label>
    //         </div>
    //         <br />
    //         <br />
    //         <button className="button add-button" type='submit'>Add Location</button>
    //     </form>
    // )

    return (
        <div>
            <ReactModal
                name="addModal"
                isOpen={showAddModal}
                contentLabel="Add Modal"
                style={customStyles}>
                <AddLocationForm
                    handleClose={props.handleClose}
                    uploadLocation={uploadLocation}
                    setShowAddModal={setShowAddModal}
                />
                <button className='button cancel-button' onClick={()=>handleCloseAddModal()}>Cancel</button>
            </ReactModal>

        </div>
    )

}

export default AddLocationModal;