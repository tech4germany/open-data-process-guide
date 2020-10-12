import * as React from 'react';
import { useState, useEffect } from "react";
import { Model } from "../model/Model";
import styles from "../components/Guido.module.scss";
import { Case } from "../model/Case";
import { SearchBox, Checkbox, ICheckboxStyles, PrimaryButton } from "office-ui-fabric-react";
import Utils from "../model/Utils";

export interface ICaseDashboardProps {
    model: Model;
    cases: any[];
    activeCase: Case;
    changeNotifs: any;
    onContinueCase: any;
    onDeleteCase: any;
    onStartDefaultCase: any;
}

export default function CasesDashboard(props: ICaseDashboardProps) {

    const [selectedCaseInTable, setSelectedCaseInTable] = useState(null);
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
        setSelectedCaseInTable(null);
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
        },
        selectedCaseInTable: {
            backgroundColor: 'white'
        }
    };

    return (
        <>
            <span className={styles.title}>Willkommen, {props.model && props.model.getCurrentUser().displayName}!</span>
            <br/><br/>
            Danke das Sie Open Data für Ihr Ministerium bereit stellen möchten.
            <br/><br/>
            Guido hilft Ihnen dabei Ihre Datensätze durch den Prozess der Datenbereitstellung zu führen.
            <br/>
            Dabei werden Ihnen hilfreiche Informationen, genau dort, wo sie benötigt werden, zur Verfügung gestellt.
            <br/><br/>
            Klicken Sie auf "Neue Bereitstellung", um eine neue Datenbereitstellung zu starten.
            <br/><br/>
            <PrimaryButton onClick={props.onStartDefaultCase}>Neue Bereitstellung</PrimaryButton>
            <br/><br/><br/>
            <span className={styles.subtitle}>Übersicht der Bereitstellungsprozesse in Ihrem Ministerium
                {props.model && <>{': ' + props.model.specifications.config.ministry}</>}</span>
            <br/><br/>
            {props.cases.length > 0 ?
                <>
                    <b>Suche</b><br/>
                    <SearchBox placeholder="z.B. Protokolldaten 2020" onChange={val => setSearchStr(val)}/>
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
                    {selectedCaseInTable &&
                        <>
                            {selectedCaseInTable.id + ':'}
                            {' '}<a href='#' onClick={() => continueCase(selectedCaseInTable)}>Weiter bearbeiten</a>,
                            {' '}<a href='#' onClick={() => deleteCase(selectedCaseInTable)}>Löschen</a>,
                            {' '}<a href='#' onClick={() => generateRDF(selectedCaseInTable)}>Metadaten generieren</a>
                            <br/>
                        </>
                    }
                    <table className={styles.casesTable}>
                        <thead>
                        <tr>
                            <th>Titel</th>
                            <th>Erstellt am</th>
                            <th>Fortschritt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {props.cases.filter(caseObj => meetsSearchCriteria(caseObj)).map(caseObj =>
                            <tr key={caseObj.id}
                                style={caseObj === selectedCaseInTable ? stylesDef.selectedCaseInTable : {}}
                                onClick={() => setSelectedCaseInTable(selectedCaseInTable === caseObj ? null : caseObj)}
                            >
                                <td>{caseObj === props.activeCase && <small>[Aktiv] </small>}{caseObj.id/*Title TODO*/}</td>
                                <td>{Utils.getFormattedTime(caseObj.startTime)}</td>
                                <td>TODO</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </>
                :
                <>
                    Noch keine Bereitstellungsprozesse vorhanden
                </>
            }
        </>
    );
}
