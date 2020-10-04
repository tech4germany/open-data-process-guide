import * as React from 'react';
import { useEffect, useState } from "react";
import * as Fabric from "office-ui-fabric-react";

export interface IFieldProps {
    details: any;
    onEdit: any;
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
                return <Fabric.TextField
                    label={details.title}
                    onChanged={val => {
                        console.log(details.title, val);
                    }}
                />;
            case 'boolean':
                return <Fabric.Checkbox
                    label={details.title}
                    onChange={(e, isChecked) => {
                        console.log(details.title, isChecked);
                    }}
                />;
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
