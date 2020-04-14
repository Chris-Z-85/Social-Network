import React, { useState } from 'react';



export function useStatefulFields() {
    const [values, setValues] = useState({});

    const handleChange = e => {
        setValues({
            ...setValues,
            [e.target.name]: e.target.value
        });
    };

    return [values, handleChange];

}