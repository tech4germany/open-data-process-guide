import * as React from 'react';
import { useState, useEffect } from "react";
import Case from "./Case";
import {Model} from "../model/Model";

export interface IActiveCaseProps {
    model: Model;
    case: any;
}

export default function ActiveCase(props: IActiveCaseProps) {

    const [activeCase, setActiveCase] = useState(null); // a Process object

    useEffect(() => {});

    return (
        <>
            Active case
            <Case process={activeCase}/>
        </>
    );
}
