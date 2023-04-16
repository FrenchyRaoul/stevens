import React from 'react';

import AddLocationForm from "./AddLocationForm";
import {useMutation} from "@apollo/client";
import queries from "../queries";


function NewLocation(props) {
    const [uploadLocation] = useMutation(queries.ADD_LOCATION, {
        update(cache, {data: {uploadLocation}}) {
            const {locations} = cache.readQuery({query: queries.GET_USER_LOCATIONS});
            cache.writeQuery({
                    query: queries.GET_USER_LOCATIONS,
                    data: {locations: locations.concat([uploadLocation])}
                }
            )
        }
    });

    return (
        <div>
            <AddLocationForm
                uploadLocation={uploadLocation}
                handleClose={()=>{}}
                setShowAddModal={()=>{}}
            />
        </div>
    )
}

export default NewLocation;