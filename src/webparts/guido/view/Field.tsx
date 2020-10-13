import * as React from 'react';
import { useEffect, useState } from "react";
import { TextField, Checkbox, HoverCard, HoverCardType, IPlainCardProps } from "office-ui-fabric-react";
import Utils from "../model/Utils";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import styles from "../components/Guido.module.scss";
import { Model } from "../model/Model";
import { Case } from "../model/Case";
import UploadFilesField from "./UploadFilesField";

export interface IFieldProps {
    model: Model;
    case: Case;
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
            // TODO nicer if-else construct?
            if (params.type === 'multi-select-checkboxes' && !props.initialValue) {
                let encodedStr = '';
                params.options.map(o => encodedStr += '0');
                setValue(encodedStr);
            } else if (params.type === 'day-picker-from-to' && !props.initialValue) {
                setValue('|');
            } else {
                setValue(props.initialValue);
            }
        }
    });

    const wrapInTable = (fieldEl, fieldTdStyle, iconStyle) => {
        // for Icons see here https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
        return <table>
            <tbody>
                <tr>
                    <td style={fieldTdStyle}>
                        {fieldEl}
                    </td>
                    <td>
                        {params.info && wrapInfoIconInHoverCard(<Icon iconName='Info' style={iconStyle}/>)}
                    </td>
                </tr>
            </tbody>
        </table>;
    };

    const plainCardProps: IPlainCardProps = {
        onRenderPlainCard: () => {
            return (
                <div style={stylesDef.hoverCardDiv}>
                    <b>{params.label}</b>
                    <br/><br/>
                    {/* via https://stackoverflow.com/a/19277723, find a non-"dangerous" way? TODO */}
                    <div dangerouslySetInnerHTML={{__html: params.info}} />
                </div>
            );
        },
    };

    const wrapInfoIconInHoverCard = icon => {
        return <HoverCard
            cardDismissDelay={100}
            type={HoverCardType.plain}
            plainCardProps={plainCardProps}
            // use margin-left to move the window a bit away? or expandingCardProps:
            // https://docs.microsoft.com/en-us/javascript/api/examples/hovercard?view=office-ui-fabric-react-latest
        >
            {icon}
        </HoverCard>;
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
            />;
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
        return <>{rowElements}</>;
    };

    const buildDayPickerFromTo = () => {
        let label1 = params.label.split('|')[0];
        let label2 = params.label.split('|')[1];
        let value1 = value ? value.split('|')[0] : '';
        let value2 = value ? value.split('|')[1] : '';
        return <table>
            <tbody>
            <tr>
                <td style={stylesDef.shortFieldTdLeft}>
                    <TextField
                        label={label1}
                        value={value1}
                        placeholder={params.placeholder}
                        onChanged={val => {
                            let newValue = val + '|' + value.split('|')[1];
                            setValue(newValue);
                            props.onEdit(newValue);
                        }}
                    />
                </td>
                <td style={stylesDef.shortFieldTdRight}>
                    <TextField
                        label={label2}
                        value={value2}
                        placeholder={params.placeholder}
                        onChanged={val => {
                            let newValue = value.split('|')[0] + '|' + val;
                            setValue(newValue);
                            props.onEdit(newValue);
                        }}
                    />
                </td>
                <td>
                    {wrapInfoIconInHoverCard(<Icon iconName='Info' style={stylesDef.infoIconSingleRow}/>)}
                </td>
            </tr>
            </tbody>
        </table>
    };

    const buildField = () => {
        // developer.microsoft.com/en-us/fluentui#/controls/web
        switch(params.type) {
            case 'label-only':
                // TODO can have info too
                return <b>{params.label}</b>
            case 'day-picker-from-to':
                return buildDayPickerFromTo();
            case 'tag-creator':
            // build one following this: https://github.com/microsoft/fluentui/issues/9008#issuecomment-490600178
            case 'multitextfieldlong':
            case 'multitextfield':
            case 'textfield':
                let isMulti = false;
                let textFieldRows = 1;
                let textFieldIconStyle = stylesDef.infoIconSingleRow;
                if (params.type === 'multitextfield') {
                    isMulti = true;
                    textFieldRows = 5;
                    textFieldIconStyle = stylesDef.infoIconMultiRow;
                }
                if (params.type === 'multitextfieldlong') {
                    isMulti = true;
                    textFieldRows = 12;
                    textFieldIconStyle = stylesDef.infoIconMultiRowLong;
                }
                // multiline etc. if needed: https://github.com/dock365/reform-fabric-fields/blob/9c67bbadc4715a740187d074f6e32bc4e16a97aa/src/MultilineTextField.tsx#L38
                return wrapInTable(
                    <TextField
                        label={params.label + (params.mandatory ? ' *' : '')}
                        value={value ? value : ''}
                        multiline={isMulti}
                        rows={textFieldRows}
                        placeholder={params.placeholder ? params.placeholder : ''}
                        onChanged={val => {
                            setValue(val);
                            props.onEdit(val);
                        }}
                    />,
                    stylesDef.fieldTd,
                    textFieldIconStyle
                );
            case 'checkbox':
                return wrapInTable(<Checkbox
                    label={params.label}
                    checked={value ? value : false}
                    onChange={(e, isChecked) => {
                        setValue(isChecked);
                        props.onEdit(isChecked);
                    }}
                />,
                null,
                null)
            case 'multi-select-checkboxes':
                return <>
                    {wrapInTable(params.label, null, stylesDef.infoIconLabel)}
                    <table className={styles.multiSelectFieldTable}>
                        <tbody>
                            {buildMultiSelectRows()}
                        </tbody>
                    </table>
                </>;
            case 'upload-files':
                return <>
                    {wrapInTable(params.label, null, stylesDef.infoIconLabel)}
                    <UploadFilesField
                        model={props.model}
                        case={props.case}
                        onEdit={props.onEdit}
                    />
                </>;
            case 'select-dropdown':
            case 'radiobox-group-two':
            default:
                return <>{params.label} {'-->'} <i>{params.type}, not yet implemented</i></>;
        }
    };

    // STYLES

    let stylesDef: any = {
        fieldTd: {
            width: '100%'
        },
        shortFieldTdLeft: {
            width: '40%',
            paddingRight: '20px'
        },
        shortFieldTdRight: {
            width: '40%'
        },
        // transform and color is the same in all, share it somehow? TODO
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
        infoIconMultiRowLong: {
            paddingBottom: '112px',
            paddingLeft: '15px',
            transform: 'scale(1.4)',
            color: '#00000080'
        },
        infoIconLabel: { // next to label
            paddingTop: '5px',
            paddingLeft: '12px',
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
        },
        hoverCardDiv: {
            padding: '20px'
        }
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
