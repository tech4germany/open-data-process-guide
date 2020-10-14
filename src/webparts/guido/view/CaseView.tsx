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

    // Method to decide if progress bar icons in header are filled or not
    // let progress = 0;

    // const checkProgress = () => { 
    //     switch (progress[0]]) {
    //         case "Step1":
    //             progress  = 0;
    //           break;
    //         case "Step2":
    //             progress  = 1;
    //         break;
    //         case "Step3":
    //             progress  = 2;
    //         break;
    //         case "Step4":
    //             progress  = 3;
    //         break;
    //         case "Step5":
    //             progress  = 4;
    //         break;
    //         case "Step6":
    //             progress  = 5;
    //         break;
    //         case "Step7":
    //             progress  = 6;
    //         break;
    //         default: 
    //         progress = 0;
    //         break;
    //     }       
    // };

    return (
        <>
        
            {props.case && (
                <>
                    <div className={styles.headercontainer}>
                            <div className={styles.headertitlecontainer}>
                                <div className={styles.headertitle}>Titel</div>
                                <div className={styles.headersubtitle}>Subtitel</div>
                                <Button>Datensatz einsehen</Button>
                            </div>
                            <div className={styles.headerfortschritt}>
                                <div className={styles.headerfortschritttext}>
                                    Fortschritt der Bereitstellung
                                </div>
                                <div className={styles.headericons}>
                                    <Icon iconName='SkypeCircleCheck' className={styles.headericon} /> <hr className={styles.headerhr}></hr>
                                    <Icon iconName='SkypeCircleCheck' className={styles.headericon} /> <hr className={styles.headerhr}></hr>
                                    <Icon iconName='SkypeCircleCheck' className={styles.headericon} /> <hr className={styles.headerhr}></hr>
                                    <Icon iconName='SkypeCircleCheck' className={styles.headericon} /> <hr className={styles.headerhr}></hr>
                                    <Icon iconName='SkypeCircleCheck' className={styles.headericon} /> <hr className={styles.headerhr}></hr>
                                    <Icon iconName='SkypeCircleCheck' className={styles.headericon} /> 
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
                        caseId={props.case.id}
                        module={getModule()}
                        initialValues={getInitialValues()}
                        onEdit={(fieldId, value) => onEdit(fieldId, value)}
                    />
                    <br/><br/>
                    <div>
                        {step > 0 &&
                            <p style={{ float: 'left' }}>
                                <PrimaryButton onClick={previousStep}>Zurück</PrimaryButton>
                            </p>
                        }
                        <p style={{ float: 'right' }}>
                            <PrimaryButton onClick={nextStep}>{isLastStep() ? 'Bereitstellung abschließen' : 'Speichern und freigeben'}</PrimaryButton>
                        </p>
                    </div>
                </>
            )}
        </>
    );
}
