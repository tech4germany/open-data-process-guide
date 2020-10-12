import * as React from 'react';
import { useEffect, useState } from "react";
import { TextField, Checkbox, ITextFieldProps } from "office-ui-fabric-react";
import Utils from "../model/Utils";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import styles from "../components/Guido.module.scss";

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
        if (!value && params) {
            if (params.type === 'multi-select-checkboxes' && !props.initialValue) {
                let encodedStr = '';
                params.options.map(o => encodedStr += '0');
                setValue(encodedStr);
            } else {
                setValue(props.initialValue);
            }
        }
    });

    const wrapInTable = (fieldEl, iconStyle) => {
        return <table>
            <tbody>
                <tr>
                    <td style={stylesDef.paramWrappingTd}>
                        {fieldEl}
                    </td>
                    <td>
                        <Icon iconName='Info' style={iconStyle}/>
                    </td>
                </tr>
            </tbody>
        </table>
    };

    // STYLES

    let stylesDef: any = {
        paramWrappingTd: {
            width: '100%'
        },
        infoIconSingleRow: {
            paddingTop: '24px',
            paddingLeft: '15px',
            transform: 'scale(1.4)',
            color: '#00000080'
        },
        infoIconMultiRow: {
            paddingBottom: '24px',
            paddingLeft: '15px',
            transform: 'scale(1.4)',
            color: '#00000080'
        },
        infoIconMultiSelectLabel: {
            paddingTop: '10px',
            paddingLeft: '15px',
            transform: 'scale(1.4)',
            color: '#00000080'
        },
        multiSelectLabel: {
            paddingBottom: '15px'
        }
    };

    const buildField = () => {
        // developer.microsoft.com/en-us/fluentui#/controls/web
        switch(params.type) {
            case 'tag-creator':
                // build one following this: https://github.com/microsoft/fluentui/issues/9008#issuecomment-490600178
            case 'multitextfield':
            case 'textfield':
                let isMulti = params.type === 'multitextfield';
                // multiline etc. if needed: https://github.com/dock365/reform-fabric-fields/blob/9c67bbadc4715a740187d074f6e32bc4e16a97aa/src/MultilineTextField.tsx#L38
                return wrapInTable(
                    <TextField
                        label={params.label + (params.mandatory ? ' *' : '')}
                        value={value ? value : ''}
                        multiline={isMulti}
                        rows={isMulti ? 5 : 1}
                        placeholder={params.placeholder ? params.placeholder : ''}
                        onChanged={val => {
                            setValue(val);
                            props.onEdit(val);
                        }}
                    />,
                    isMulti ? stylesDef.infoIconMultiRow : stylesDef.infoIconSingleRow
                )
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
                    <div style={stylesDef.multiSelectLabel}>
                        {params.label}
                        <Icon iconName='Info' style={stylesDef.infoIconMultiSelectLabel}/>
                    </div>
                    <table className={styles.multiSelectFieldTable}>
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

        const buildCheckbox = (label, idx) => {
            return <Checkbox
                label={label}
                checked={value ? value.charAt(idx) === '1' : false}
                onChange={(e, isChecked) => {
                    let encodedStr = Utils.replaceAt(value, idx, isChecked ? '1' : '0');
                    setValue(encodedStr);
                    props.onEdit(encodedStr);
                }}
            />
        };

        for (let i = 0; i < params.options.length; i += 2) {
            let label1 = params.options[i];
            let label2 = params.options[i + 1];
            rowElements.push(
                <tr key={i}>
                    <td>
                        {buildCheckbox(label1, i)}
                    </td>
                    <td>
                        {label2 &&
                            buildCheckbox(label2, i + 1)
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
