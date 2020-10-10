import * as React from 'react';
import { useState, useEffect } from "react";
import { Model } from "../model/Model";
import Utils from "../model/Utils";
import styles from "../components/Guido.module.scss";
import { Case } from "../model/Case";
import {SearchBox, Checkbox, ICheckboxStyles, DetailsListLayoutMode} from "office-ui-fabric-react";
import { DetailsList, Selection } from "office-ui-fabric-react/lib/DetailsList";

export interface ICaseDashboardProps {
    model: Model;
    cases: any[];
    activeCase: Case;
    changeNotifs: any;
    onContinueCase: any;
    onDeleteCase: any;
}

export default function CasesDashboard(props: ICaseDashboardProps) {

    const [filter, setFilter] = useState(null); // can be: null, onlyActive, onlyCompleted
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
        if (
            (filter === 'onlyActive' && caseObj.isCompleted) ||
            (filter === 'onlyCompleted' && !caseObj.isCompleted)
        ) {
            return false;
        }
        // use (or combine with?) Title TODO
        return caseObj.id.toLowerCase().includes(searchStr.toLowerCase());
    };

    // CASES TABLE

    const casesTableColumns = [
        { key: 'col1', name: 'Titel', fieldName: 'title', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'col2', name: 'Erstellt am', fieldName: 'startTime', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'col3', name: 'Fortschritt', fieldName: 'progress', minWidth: 100, maxWidth: 200, isResizable: true },
    ];

    let casesTableSelection = new Selection({
        onSelectionChanged: () => console.log(casesTableSelection.getSelection())
    });

    const getCasesTableItems = () => {
        return props.cases
            .filter(caseObj => meetsSearchCriteria(caseObj))
            .map((caseObj, idx) => {
                return {
                    key: idx,
                    title: caseObj.id,
                    startTime: Utils.getFormattedTime(caseObj.startTime),
                    progress: 'TODO'
                }
            });
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
                <Checkbox
                    styles={checkbox}
                    label='nur laufende Prozesse'
                    checked={filter === 'onlyActive'}
                    onChange={(e, isChecked) => {
                        setFilter(filter === 'onlyActive' ? null : 'onlyActive');
                    }}
                />
                <Checkbox
                    styles={checkbox}
                    label='nur abgeschlossene Prozesse'
                    checked={filter === 'onlyCompleted'}
                    onChange={(e, isChecked) => {
                        setFilter(filter === 'onlyCompleted' ? null : 'onlyCompleted');
                    }}
                />
            </div>
            <br/><br/>
            <DetailsList
                items={getCasesTableItems()}
                columns={casesTableColumns}
                selection={casesTableSelection}
            />
            {/*props.cases
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
            )*/}
        </>
    );
}
