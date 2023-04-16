import React from 'react';

function AddLocationForm(props) {
    let image;
    let address;
    let name;

    return (
        <form className="form" id="add-location" onSubmit={(e) =>{
            e.preventDefault();
            props.uploadLocation({
                variables:{
                    image: image.value,
                    address: address.value,
                    name: name.value,
                }
            });
            image.value = '';
            address.value = '';
            name.value = '';
            props.setShowAddModal(false);
            props.handleClose()
            alert("Location added!");
        }}>
            <div className="form-group">
                <label>Image
                    <br />
                    <input
                        ref={(node)=>{
                            image = node;
                        }}
                        required
                        autoFocus={true} />
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
                        required/>
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
                        required/>
                </label>
            </div>
            <br />
            <br />
            <button className="button add-button" type='submit'>Add Location</button>
        </form>
    )
}

export default AddLocationForm;
