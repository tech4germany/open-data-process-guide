import * as React from 'react';
import { useEffect, useState } from "react";
import * as Fabric from "office-ui-fabric-react";

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

    const buildField = () => {
        // https://developer.microsoft.com/en-us/fluentui#/controls/web
        switch(details.type) {
            case 'string':
                return <Fabric.TextField label={details.title} />;
            case 'boolean':
                return <Fabric.Checkbox label={details.title} onChange={() => {}} />;
        }
    };

    return (
        details &&  (
            <>
                {buildField()}
                <br/>
            </>
        )
    );
}
