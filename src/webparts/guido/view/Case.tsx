import * as React from 'react';
import { useEffect, useState } from "react";
import {Process} from "../model/Process";

export interface ICaseProps {
    process: Process;
}

export default function Case(props: ICaseProps) {

    const [process, setProcess] = useState(null);

    useEffect(() => {
        if (!process) {
            setProcess(props.process);
        }
    });

    return (
        <>
        </>
    );
}
