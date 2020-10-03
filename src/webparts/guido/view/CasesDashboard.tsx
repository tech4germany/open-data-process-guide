import * as React from 'react';
import { useState, useEffect } from "react";
import { Model } from "../model/Model";
import Utils from "../model/Utils";

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
                    {caseObj.id},
                    <small>
                        {' '}Started: {Utils.getFormattedTime(caseObj.startTime)},
                        {' '}Progress: {caseObj.getProgress()}%
                    </small>
                </li>
            )}
        </>
    );
}
