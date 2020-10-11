import * as React from 'react';
import { useEffect, useState } from "react";
import { TextField, Checkbox } from "office-ui-fabric-react";

export interface IFieldProps {
    details: any;
    onEdit: any;
    initialValue: any;
}

export default function Field(props: IFieldProps) {

    const [params, setParams] = useState(null); // parameters = fields within a field
    const [value, setValue] = useState(null);

    useEffect(() => {
        if (!params) {
            setParams(props.details);
        }
        if (!value) {
            setValue(props.initialValue);
        }
    });

    const buildField = () => {
        // developer.microsoft.com/en-us/fluentui#/controls/web
        switch(params.type) {
            case 'tag-creator':
                // build one following this: https://github.com/microsoft/fluentui/issues/9008#issuecomment-490600178
            case 'multitextfield':
            case 'textfield':
                // multiline etc. if needed: https://github.com/dock365/reform-fabric-fields/blob/9c67bbadc4715a740187d074f6e32bc4e16a97aa/src/MultilineTextField.tsx#L38
                return <TextField
                    label={params.label + (params.mandatory ? ' *' : '')}
                    value={value ? value : ''}
                    multiline={params.type === 'multitextfield'}
                    rows={params.type === 'multitextfield' ? 5 : 1}
                    placeholder={params.placeholder ? params.placeholder : ''}
                    onChanged={val => {
                        setValue(val);
                        props.onEdit(val);
                    }}
                />;
            case 'checkbox':
                return <Checkbox
                    label={params.label}
                    checked={value ? value : false}
                    onChange={(e, isChecked) => {
                        setValue(isChecked);
                        props.onEdit(isChecked);
                    }}
                />;
            case 'multi-select-checkboxes':
                return <>
                    {params.label}
                    <table>
                    <tbody>
                        {buildMultiSelectRows()}
                    </tbody>
                    </table>
                </>
            default:
                return <>{params.label}': not yet implemented'</>;
        }
    };

    const buildMultiSelectRows = () => {
        let rowElements = [];
        for (let i = 0; i < params.options.length; i += 2) {
            let label1 = params.options[i];
            let label2 = params.options[i + 1];
            rowElements.push(
                <tr key={i}>
                    <td>
                        <Checkbox
                            label={label1}
                        />
                    </td>
                    <td>
                        {label2 &&
                            <Checkbox
                                label={label2}
                            />
                        }
                    </td>
                </tr>
            );
        }
        return <>{rowElements}</>
    };

    return (
        params &&  (
            <>
                {buildField()}
                <br/>
            </>
        )
    );
}
