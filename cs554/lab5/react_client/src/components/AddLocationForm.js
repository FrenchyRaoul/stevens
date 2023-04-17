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
                <label className='w-100'>*Name
                    <br />
                    <input
                        className='w-100'
                        ref={(node)=>{
                            name = node;
                        }}
                        required
                        autoFocus={true}
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
                    />
                </label>
            </div>
            <br />
            <br />
            <button className="button add-button" type='submit'>Add Location</button>
        </form>
    )
}

export default AddLocationForm;
