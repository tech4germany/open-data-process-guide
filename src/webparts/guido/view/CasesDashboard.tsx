import * as React from 'react';
import { useState, useEffect } from "react";
import { Model } from "../model/Model";
import Utils from "../model/Utils";
import styles from "../components/Guido.module.scss";
import { Case } from "../model/Case";

export interface ICaseDashboardProps {
    model: Model;
    cases: any[];
    activeCase: Case;
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
                    {caseObj === props.activeCase && <small>[active] </small>}
                    {caseObj.id},
                    <small>
                        {' '}Started: {Utils.getFormattedTime(caseObj.startTime)},
                        {' '}Progress: {caseObj.getProgress()}%,
                        {' '}<a href='#' onClick={() => continueCase(caseObj)}>continue editing</a>,
                        {' '}<a href='#' onClick={() => deleteCase(caseObj)}>delete</a>
                    </small>
                </li>
            )}
        </>
    );
}
