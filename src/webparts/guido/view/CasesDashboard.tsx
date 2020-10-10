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
    changeNotifs: any;
    onContinueCase: any;
    onDeleteCase: any;
}

export default function CasesDashboard(props: ICaseDashboardProps) {

    const [activeCaseProgressStr, setActiveCaseProgressStr] = useState('');

    useEffect(() => {
        // gets triggered via props.changeNotifs for every edit in Tasks
        if (props.activeCase) {
            setActiveCaseProgressStr(props.activeCase.getProgressStr());
        }
    });

    const continueCase = caseObj => {
        props.onContinueCase(caseObj);
    };

    const deleteCase = caseObj => {
        props.onDeleteCase(caseObj);
    };

    const generateRDF = (caseObj) => {
        alert('TODO');
    };

    return (
        <>
            <span className={styles.title}>Übersicht der Bereitstellungsprozesse in Ihrem Ministerium
                {props.model && <>{': ' + props.model.specifications.config.ministry}</>}</span>
            <br/><br/>
            <b>Offene Bereitstellungen</b>:<br/>
            {props.cases.map((caseObj, idx) =>
                <li key={'case_' + idx}>
                    {caseObj === props.activeCase && <small>[Aktiv] </small>}
                    {caseObj.id},
                    <small>
                        {' '}Start: {Utils.getFormattedTime(caseObj.startTime)},
                        {' '}Fortschritt: {caseObj === props.activeCase ? activeCaseProgressStr : caseObj.getProgressStr()}
                        <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {' '}<a href='#' onClick={() => continueCase(caseObj)}>Weiter bearbeiten</a>,
                        {' '}<a href='#' onClick={() => deleteCase(caseObj)}>Löschen</a>,
                        {' '}<a href='#' onClick={() => generateRDF(caseObj)}>Metadaten generieren</a>
                    </small>
                </li>
            )}
        </>
    );
}
