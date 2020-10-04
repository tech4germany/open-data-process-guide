import * as React from 'react';
import { useEffect, useState } from "react";
import * as Fabric from "office-ui-fabric-react";

export interface IFieldProps {
    details: any;
    onEdit: any;
}

export default function Field(props: IFieldProps) {

    const [details, setDetails] = useState(null);
    const [value, setValue] = useState(null);

    useEffect(() => {
        if (!details) {
            setDetails(props.details);
        }
    });

    const buildField = () => {
        // https://developer.microsoft.com/en-us/fluentui#/controls/web
        switch(details.type) {
            case 'string':
                return <Fabric.TextField
                    label={details.title}
                    value={value ? value : ''}
                    onChanged={val => {
                        setValue(val);
                        props.onEdit(val);
                    }}
                />;
            case 'boolean':
                return <Fabric.Checkbox
                    label={details.title}
                    checked={value ? value : false}
                    onChange={(e, isChecked) => {
                        setValue(isChecked);
                        props.onEdit(isChecked);
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
