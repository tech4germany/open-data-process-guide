import * as React from 'react';
import { useState, useEffect } from "react";
import { Model } from "../model/Model";
import Utils from "../model/Utils";
import styles from "../components/Guido.module.scss";
import { Case } from "../model/Case";
import { SearchBox, Checkbox, ICheckboxStyles } from "office-ui-fabric-react";

export interface ICaseDashboardProps {
    model: Model;
    cases: any[];
    activeCase: Case;
    changeNotifs: any;
    onContinueCase: any;
    onDeleteCase: any;
}

export default function CasesDashboard(props: ICaseDashboardProps) {

    const [searchStr, setSearchStr] = useState('');
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

    const meetsSearchCriteria = caseObj => {
        // use (or combine with?) Title TODO
        return caseObj.id.toLowerCase().includes(searchStr.toLowerCase());
    };

    // STYLES

    let checkbox: ICheckboxStyles = {
        root: {
            float:'left',
            paddingRight: '15px'
        }
    };

    let stylesDef: any = {
        filterDiv: {
            paddingTop: '7px'
        },
        filterLabel: {
            float: 'left',
            paddingRight: '30px'
        }
    };

    return (
        <>
            <span className={styles.title}>Übersicht der Bereitstellungsprozesse in Ihrem Ministerium
                {props.model && <>{': ' + props.model.specifications.config.ministry}</>}</span>
            <br/><br/>
            <b>Suche</b><br/>
            <SearchBox placeholder="z.B. Protokolldaten 2020" onChange={val => setSearchStr(val)} />
            <br/>
            <div style={stylesDef.filterDiv}>
                <b style={stylesDef.filterLabel}>Filter</b>
                <Checkbox styles={checkbox} label='nur laufende Prozesse'/>
                <Checkbox styles={checkbox} label='nur abgeschlossene Prozesse'/>
            </div>
            <br/><br/>
            {props.cases
                .filter(caseObj => meetsSearchCriteria(caseObj))
                .map((caseObj, idx) =>
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
