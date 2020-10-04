import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import Task from "./Task";
import * as Fabric from "office-ui-fabric-react";
import { Case } from "../model/Case";
import { Model } from "../model/Model";
import styles from "../components/Guido.module.scss";

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
        props.onChangeNotify();
    }

    const nextStep = () => {
        if (step < props.case.process.modules.length - 1) {
            updateStep(step + 1);
        }
    };

    const previousStep = () => {
        if (step >= 1) {
            updateStep(step - 1);
        }
    };

    const getHeadline = () => {
        return props.case ? 'Active Case: ' + props.case.id : 'Active Case';
    }

    // called from Task and there from Fields

    const onEdit = (fieldId, value) => {
        props.case.setValue(getModule().id, fieldId, value);
        props.model.updateCaseInStorage(props.case);
        props.onChangeNotify();
    };

    // helper methods

    const getModule = () => {
        return props.case.process.modules[step];
    };

    const getInitialValues = () => {
        return props.case.values[getModule().id];
    };

    return (
        <>
            <span className={styles.title}>{getHeadline()}</span>
            <br/><br/>
            {props.case && (
                <>
                    <i>Step: {step + 1}/{props.case.process.modules.length}</i>,
                    {' '}<small><a href='#' onClick={props.stopEditing}>stop editing</a></small>
                    <br/><br/><br/>
                    <Task
                        caseId={props.case.id}
                        module={getModule()}
                        initialValues={getInitialValues()}
                        onEdit={(fieldId, value) => onEdit(fieldId, value)}
                    />
                    <br/><br/>
                    <div>
                        <p style={{ float: 'left' }}>
                            <Fabric.PrimaryButton onClick={previousStep}>Back</Fabric.PrimaryButton>
                        </p>
                        <p style={{ float: 'right' }}>
                            <Fabric.PrimaryButton onClick={nextStep}>Next</Fabric.PrimaryButton>
                        </p>
                    </div>
                </>
            )}
        </>
    );
}
