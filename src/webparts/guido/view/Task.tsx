import * as React from 'react';
import { useEffect, useState } from "react";
import { Module } from "../model/Module";
import Field from "./Field";
import styles from "../components/Guido.module.scss";
import { Model } from "../model/Model";
import { Case } from "../model/Case";
import { PrimaryButton } from "office-ui-fabric-react";

export interface ITaskProps {
    model: Model;
    case: Case;
    module: Module;
    onEdit: any;
    initialValues: any;
    step: number;
}

export default function Task(props: ITaskProps) {

    // #ConceptualDecision: refactor to no use Module and instead derive fields
    // from instantiated Case that knows about the fields (via Module)?
    const [module, setModule] = useState(null);
    // undecided, currentUser or responsibleUser
    const [taskClaimStatus, setTaskClaimStatus] = useState('currentUser');

    useEffect(() => {
        if (props.module !== module) {
            setModule(props.module);
            let responsibleUsersStatus = props.case.values[props.module.id].responsibleUsersStatus;
            if (responsibleUsersStatus) {
                setTaskClaimStatus(responsibleUsersStatus);
            }
        }
    });

    // STYLES

    let stylesDef: any = {
        editorLabel: {
            color: '#0078D7',
            fontWeight: 'bold'
        },
        claimTaskBtnTable: {
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        claimTaskBtnTableTd: {
            padding: '5px'
        }
    };

    const currentUserClaimsTask = () => {
        setTaskClaimStatus('currentUser');
        props.onEdit('responsibleUsersStatus', 'currentUser')
    };

    const passTaskToResponsibleUser = () => {
        setTaskClaimStatus('responsibleUser');
        props.onEdit('responsibleUsersStatus', 'responsibleUser')
    };

    const buildTask = () => {
        let role;
        switch (taskClaimStatus) {
            case 'currentUser':
                return <>
                    <br/>
                    <div style={stylesDef.editorLabel}>Bearbeiter: {props.model.getCurrentUser().displayName}</div>
                    <br/>
                    {module.config.description}
                    <br/><br/>
                    {Object.keys(module.config.fields).map(fieldId =>
                        <Field
                            model={props.model}
                            case={props.case}
                            key={'case-' + props.case.id + '_module-' + module.id + '_field-' + fieldId}
                            details={module.config.fields[fieldId]}
                            onEdit={value => props.onEdit(fieldId, value)}
                            initialValue={props.initialValues[fieldId]}
                        />)}
                    </>
            case 'undecided':
                role = props.model.specifications.config.roles[props.module.config.responsible];
                return <>
                    <br/>
                    Für diesen Schritt ist {role.article.toLowerCase() + ' ' + role.label + ' (' + role.email + ')'} verantwortlich.{' '}
                    Sie können die Bearbeitung selbst übernehmen oder die Stelle per Email zur Bearbeitung auffordern.
                    <br/><br/>
                    <table style={stylesDef.claimTaskBtnTable}>
                        <tbody>
                        <tr>
                            <td style={stylesDef.claimTaskBtnTableTd}>
                                <PrimaryButton onClick={currentUserClaimsTask}>Selbst bearbeiten</PrimaryButton>
                            </td>
                            <td style={stylesDef.claimTaskBtnTableTd}>
                                <PrimaryButton onClick={passTaskToResponsibleUser}>{role.article + ' ' + role.label} benachrichtigen</PrimaryButton>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </>;
            case 'responsibleUser':
                role = props.model.specifications.config.roles[props.module.config.responsible];
                return <>
                    <br/>
                    {role.article + ' ' + role.label} wurde zur Bearbeitung dieser Aufgabe eingeladen.
                </>
            default:
                return 'undefined';
        }
    };

    return (
       module &&  (
            <>
                <span className={styles.subtitle}>{'Schritt ' + props.step + ' - ' + module.config.name}</span>
                <br/>
                {buildTask()}
            </>
        )
    );
}
