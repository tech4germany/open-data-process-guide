import * as React from 'react';
import { useEffect, useState } from "react";
import {Process} from "../model/Process";
import Task from "./Task";

export interface ICaseProps {
    process: Process;
}

export default function Case(props: ICaseProps) {

    const [process, setProcess] = useState(null);
    const [step, setStep] = useState(0);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (!process) {
            setProcess(props.process);
            setTasks(props.process.modules.map(module => <Task module={module}/>))
        }
    });

    return (
        tasks.length > 0 && (
            <>
                <i>Step: {step + 1}/{tasks.length}</i>
                <br/><br/>
                {tasks[step]}
            </>
        )
    );
}
