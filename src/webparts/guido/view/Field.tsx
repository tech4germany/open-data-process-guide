import * as React from 'react';
import { useEffect, useState } from "react";

export interface IFieldProps {
    details: any;
}

export default function Field(props: IFieldProps) {

    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (props.details !== details) {
            setDetails(props.details);
        }
    });

    return (
        details &&  (
            <>
                {JSON.stringify(details)}
            </>
        )
    );
}
