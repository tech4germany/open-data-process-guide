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

    const getRole = () => {
        return  props.model.specifications.config.roles[props.module.config.responsible];
    }

    const currentUserClaimsTask = () => {
        setTaskClaimStatus('currentUser');
        props.onEdit('responsibleUsersStatus', 'currentUser')
    };

    const passTaskToResponsibleUser = () => {
        setTaskClaimStatus('responsibleUser');

        // this breaks if that module is not there or called different, a more robust way? TODO
        let caseTitle = props.case.values['describe-dataset']['title'];
        if (!caseTitle) {
            caseTitle = props.case.id; // fallback
        }

        let subject = "Bitte um Bearbeitung: " + module.config.name + " - " + caseTitle;
        let link = ""; // TODO
        let body = "Guten Tag,<br><br>die Bereitstellung \"" + caseTitle + "\" ist im \"Schritt " + props.step + ": " + module.config.name + "\" gelandet und bedarf Ihrer Expertise. Bitte bearbeiten Sie die Aufgabe unter folgendem Link:<br><br>" + link + "<br><br>Vielen Dank!<br>Ihr Open Data Guide";

        props.model.sendEmail(getRole().email, subject, body);
        props.onEdit('responsibleUsersStatus', 'responsibleUser');
    };

    const buildTask = () => {
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
                return <>
                    <br/>
                    Für diesen Schritt ist {getRole().article.toLowerCase() + ' ' + getRole().label + ' (' + getRole().email + ')'} verantwortlich.{' '}
                    Sie können die Bearbeitung selbst übernehmen oder die Stelle per Email zur Bearbeitung auffordern.
                    <br/><br/>
                    <table style={stylesDef.claimTaskBtnTable}>
                        <tbody>
                        <tr>
                            <td style={stylesDef.claimTaskBtnTableTd}>
                                <PrimaryButton onClick={currentUserClaimsTask}>Selbst bearbeiten</PrimaryButton>
                            </td>
                            <td style={stylesDef.claimTaskBtnTableTd}>
                                <PrimaryButton onClick={passTaskToResponsibleUser}>{getRole().article + ' ' + getRole().label} benachrichtigen</PrimaryButton>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </>;
            case 'responsibleUser':
                return <>
                    <br/>
                    {getRole().article + ' ' + getRole().label} wurde zur Bearbeitung dieser Aufgabe eingeladen.
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
