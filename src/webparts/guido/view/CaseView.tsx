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
}

export default function CaseView(props: ICaseViewProps) {

    const [step, setStep] = useState(0);
    const currentCase = useRef(null);

    useEffect(() => {
        if (props.case !== currentCase.current) {
            currentCase.current = props.case;
            setStep(0);
        }
    });

    const nextStep = () => {
        if (step < props.case.process.modules.length - 1) {
            setStep(step + 1);
        }
    };

    return (
        <>
            <span className={styles.title}>Active Case</span>
            <br/><br/>
            {props.case && (
                <>
                    {props.case.id}, <i>Step: {step + 1}/{props.case.process.modules.length}</i>
                    <br/><br/><br/>
                    <Task module={props.case.process.modules[step]}/>
                    <br/><br/>
                    <div style={{ textAlign: 'right' }}>
                        <Fabric.PrimaryButton onClick={nextStep}>Next</Fabric.PrimaryButton>
                    </div>
                </>
            )}
        </>
    );
}
