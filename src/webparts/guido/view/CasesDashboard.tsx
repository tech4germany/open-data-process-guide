import * as React from 'react';
import { useState, useEffect } from "react";
import { Model } from "../model/Model";

export interface ICaseDashboardProps {
    model: Model;
    cases: any[];
}

export default function CasesDashboard(props: ICaseDashboardProps) {

    useEffect(() => {});

    return (
        <>
            <b>Open cases</b>:<br/>
            {props.cases.map((caseObj, idx) =>
                <li key={'case_' + idx}>
                    {caseObj.process.id}
                </li>
            )}
        </>
    );
}
