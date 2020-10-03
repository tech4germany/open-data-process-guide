import * as React from 'react';
import { useState, useEffect } from "react";
import { Model } from "../model/Model";
import Utils from "../model/Utils";
import styles from "../components/Guido.module.scss";

export interface ICaseDashboardProps {
    model: Model;
    cases: any[];
    onContinueCase: any;
    onDeleteCase: any;
}

export default function CasesDashboard(props: ICaseDashboardProps) {

    useEffect(() => {});

    const continueCase = caseObj => {
        props.onContinueCase(caseObj);
    };

    const deleteCase = caseObj => {
        props.onDeleteCase(caseObj);
    };

    return (
        <>
            <span className={styles.title}>Case Dashboard</span>
            <br/><br/>
            <b>Open cases</b>:<br/>
            {props.cases.map((caseObj, idx) =>
                <li key={'case_' + idx}>
                    {caseObj.id},
                    <small>
                        {' '}Started: {Utils.getFormattedTime(caseObj.startTime)},
                        {' '}Progress: {caseObj.getProgress()}%,
                        {' '}<a href='#' onClick={() => continueCase(caseObj)}>continue</a>,
                        {' '}<a href='#' onClick={() => deleteCase(caseObj)}>delete</a>
                    </small>
                </li>
            )}
        </>
    );
}
