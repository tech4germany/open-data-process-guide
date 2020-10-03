import * as React from 'react';
import { useState, useEffect } from "react";
import CaseView from "./CaseView";
import {Model} from "../model/Model";

export interface IActiveCaseProps {
    model: Model;
    case: any;
}

export default function ActiveCase(props: IActiveCaseProps) {

    useEffect(() => {});

    return (
        <>
            <CaseView process={props.case}/>
        </>
    );
}
