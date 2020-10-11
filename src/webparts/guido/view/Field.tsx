import * as React from 'react';
import { useEffect, useState } from "react";
import { TextField, Checkbox } from "office-ui-fabric-react";

export interface IFieldProps {
    details: any;
    onEdit: any;
    initialValue: any;
}

export default function Field(props: IFieldProps) {

    const [details, setDetails] = useState(null);
    const [value, setValue] = useState(null);

    useEffect(() => {
        if (!details) {
            setDetails(props.details);
        }
        if (!value) {
            setValue(props.initialValue);
        }
    });

    const buildField = () => {
        // developer.microsoft.com/en-us/fluentui#/controls/web
        switch(details.type) {
            case 'tag-picker':
                // build one following this: https://github.com/microsoft/fluentui/issues/9008#issuecomment-490600178
            case 'string':
                // multiline etc. if needed: https://github.com/dock365/reform-fabric-fields/blob/9c67bbadc4715a740187d074f6e32bc4e16a97aa/src/MultilineTextField.tsx#L38
                return <TextField
                    label={details.label}
                    value={value ? value : ''}
                    onChanged={val => {
                        setValue(val);
                        props.onEdit(val);
                    }}
                />;
            case 'boolean':
                return <Checkbox
                    label={details.label}
                    checked={value ? value : false}
                    onChange={(e, isChecked) => {
                        setValue(isChecked);
                        props.onEdit(isChecked);
                    }}
                />;
            case 'string-long':
                return null;
            case 'multi-select':
                return null;
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
