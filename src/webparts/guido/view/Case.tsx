import * as React from 'react';
import { useEffect, useState } from "react";
import {Process} from "../model/Process";
import Task from "./Task";
import * as Fabric from "office-ui-fabric-react";

export interface ICaseProps {
    process: Process;
}

export default function Case(props: ICaseProps) {

    const [process, setProcess] = useState(null);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!process) {
            setProcess(props.process);
        }
    });

    const nextStep = () => {
        if (step < process.modules.length - 1) {
            setStep(step + 1);
        }
    };

    return (
        process && (
            <>
                <i>Step: {step + 1}/{process.modules.length}</i>
                <br/><br/>
                <Task module={process.modules[step]}/>
                <br/><br/>
                <div style={{ textAlign: 'right' }}>
                    <Fabric.PrimaryButton onClick={nextStep}>Next</Fabric.PrimaryButton>
                </div>
            </>
        )
    );
}
