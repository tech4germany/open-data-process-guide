import * as React from 'react';
import { useState, useEffect } from "react";
import Case from "./Case";
import {Model} from "../model/Model";

export interface IActiveCaseProps {
    model: Model;
    case: any;
}

export default function ActiveCase(props: IActiveCaseProps) {

    useEffect(() => {});

    return (
        <>
            Active case:<br/><br/>
            <Case process={props.case}/>
        </>
    );
}
