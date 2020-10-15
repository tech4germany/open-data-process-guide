import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import Task from "./Task";
import { Icon, PrimaryButton, Button } from "office-ui-fabric-react";
// import { Icon } from "office-ui-fabric-react/lib/Icon";
import { Case } from "../model/Case";
import { Model } from "../model/Model";
import styles from '../components/Guido.module.scss';
import '../components/Guido.module.scss'

export interface ICaseViewProps {
    model: Model;
    case: Case;
    stopEditing: any;
    onChangeNotify: any;
}

export default function CaseView(props: ICaseViewProps) {

    const [step, setStep] = useState(0);
    const currentCase = useRef(null);
    const [inResponsibleUserTaskCompletedMode, setResponsibleUserTaskCompletedMode] = useState(false);

    useEffect(() => {
        if (props.case !== currentCase.current) {
            currentCase.current = props.case;
            setStep(props.case ? props.case.step : 0);
        }
    });

    const updateStep = newStep =>  {
        setStep(newStep);
        props.case.setStep(newStep);
        notifyChange();
    };

    const notifyChange = () => {
        props.model.updateCaseInStorage(props.case);
        props.onChangeNotify();
    };

    const isLastStep = () => {
        return step === props.case.process.modules.length - 1;
    };

    const nextStep = () => {
        if (isLastStep()) {
            // don't allow if not all mandatory fields are filled TODO
            props.case.setCompleted();
            notifyChange();
            props.stopEditing();
        } else {
            updateStep(step + 1);
        }
    };

    const previousStep = () => {
        if (step >= 1) {
            updateStep(step - 1);
        }
    };

    // called from Task and there from Fields

    const onEdit = (fieldId, value) => {
        props.case.setValue(getModule().id, fieldId, value);
        notifyChange();
    };

    // helper methods

    const getModule = () => {
        return props.case.process.modules[step];
    };

    const getInitialValues = () => {
        return props.case.values[getModule().id];
    };

    const stopEditing = () => {
        // not sure if the reset is necessary, but better play it safe for potential race conditions
        setStep(0);
        props.stopEditing();
    };

    const getTitle = () => {
        console.log("Title", props.case.id);
        return props.case.id;
    };

    const getDate = () => {
        // console.log("Date", props.getFormattedTime(caseObj.startTime));
        // return props.case.id;
    };

    const getAuthor = () => {
        console.log("Person", props.model.getCurrentUser().displayName);
        return props.model.getCurrentUser().displayName;
    };

    const buildButtons = () => {
        let responsibleUsersStatus = props.case.values[props.case.process.modules[step].id]['responsibleUsersStatus'];
        if (responsibleUsersStatus === 'responsibleUserArrived') {
            return <div>
                {props.case.process.modules[step].config['task-bottom-text'] + ' '}
                <br/>
                <p style={{ float: 'right' }}>
                    <PrimaryButton
                        onClick={() => {
                            setResponsibleUserTaskCompletedMode(true);
                            nextStep();
                        }}>
                        {'Speichern und freigeben'}
                    </PrimaryButton>
                </p>
            </div>;
        }

        return <div>
            {step > 0 &&
                <p style={{ float: 'left' }}>
                    <PrimaryButton onClick={previousStep}>Zurück</PrimaryButton>
                </p>
            }
            <p style={{ float: 'right' }}>
                <PrimaryButton onClick={nextStep}>{isLastStep() ? 'Bereitstellung abschließen' : 'Speichern und freigeben'}</PrimaryButton>
            </p>
        </div>;
    };

    return (
        <>
        
            {props.case && (
                <>
                    <div className={styles.headercontainer}>
                            <div className={styles.headertitlecontainer}>
                                <div className={styles.headertitle}>{getTitle()}</div>
                                <div className={styles.headersubtitle}>erstellt {getDate()} - von {getAuthor()}</div>
                                <Button className={styles.headerbutton}>Datensatz einsehen</Button>
                            </div>
                            <div className={styles.headerfortschritt}>
                                <div className={styles.headerfortschritttext}>
                                    Fortschritt der Bereitstellung
                                </div>
                                <div className={styles.headericons}>
                                    <Icon iconName='SkypeCircleCheck' className={step > 0 ? styles.headericonfilled : styles.headericon}/> <hr className={step > 0 ? styles.headerhrfilled : styles.headerhr}/>
                                    <Icon iconName='SkypeCircleCheck' className={step > 1 ? styles.headericonfilled : styles.headericon}/> <hr className={step > 1 ? styles.headerhrfilled : styles.headerhr}/>
                                    <Icon iconName='SkypeCircleCheck' className={step > 2 ? styles.headericonfilled : styles.headericon}/> <hr className={step > 2 ? styles.headerhrfilled : styles.headerhr}/>
                                    <Icon iconName='SkypeCircleCheck' className={step > 3 ? styles.headericonfilled : styles.headericon}/> <hr className={step > 3 ? styles.headerhrfilled : styles.headerhr}/>
                                    <Icon iconName='SkypeCircleCheck' className={step > 4 ? styles.headericonfilled : styles.headericon}/> <hr className={step > 4 ? styles.headerhrfilled : styles.headerhr}/>
                                    <Icon iconName='SkypeCircleCheck' className={step > 5 ? styles.headericonfilled : styles.headericon}/>
                                </div>
                            </div>
                    </div>


                    <br/>
                    <small><a href='#' onClick={stopEditing}>Bearbeitung beenden</a></small>
                    <br/><br/><br/>
                    <Task
                        model={props.model}
                        case={props.case}
                        step={step}
                        inResponsibleUserTaskCompletedMode={inResponsibleUserTaskCompletedMode}
                        module={getModule()}
                        initialValues={getInitialValues()}
                        onEdit={(fieldId, value) => onEdit(fieldId, value)}
                    />
                    <br/><br/>
                    {!inResponsibleUserTaskCompletedMode && buildButtons()}
                </>
            )}
        </>
    );
}
