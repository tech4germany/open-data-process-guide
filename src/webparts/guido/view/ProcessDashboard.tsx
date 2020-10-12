import * as React from 'react';
import { useState, useEffect } from "react";
import fileDownload from 'js-file-download';
import { Model } from "../model/Model";
import { Process } from "../model/Process";
import styles from "../components/Guido.module.scss";

export interface IProcessDashboardProps {
    model: Model;
    processes: Process[];
    onStartCase: any;
    onImportProcess: any;
    onDeleteProcess: any;
    defaultProcessId: any;
    onDefaultProcessChange: any;
}

export default function ProcessDashboard(props: IProcessDashboardProps) {

    const [addingProcessVia, setAddingProcessVia] = useState(null); // null, "json" or "bpmn"

    useEffect(() => {});

    const handleChange = (file: File) => {
        let reader = new FileReader();
        reader.onload = e => {
            let content = reader.result.toString();
            props.onImportProcess(addingProcessVia, file.name, content);
            setAddingProcessVia(null);
        };
        reader.readAsText(file);
    };

    const startCase = proc => {
        props.onStartCase(proc);
    };

    const deleteProc = proc => {
        props.onDeleteProcess(proc);
    };

    const downloadProc = proc => {
        let jsonStr = JSON.stringify(proc.getJSONconfig(), null, 4);
        fileDownload(jsonStr, proc.id + '.json');
    };

    const makeDefaultProc = proc => {
        props.onDefaultProcessChange(proc.id);
    };

    return (
        <>
            <span className={styles.title}>Prozessübersicht</span>
            <br/><br/>
            <b>Verfügbare Prozesse</b>:<br/>
            {props.processes.map((proc, idx) =>
                <li key={'proc_' + idx}>
                    {props.defaultProcessId && props.defaultProcessId === proc.id && <small>[Standard] </small>}
                    {proc.name},
                    <small>
                        {' '}<a href='#' onClick={() => startCase(proc)}>Bereitstellung starten</a>,
                        {' '}<a href='#' onClick={() => deleteProc(proc)}>Löschen</a>,
                        {' '}<a href='#' onClick={() => downloadProc(proc)}>Herunterladen</a>
                        {' '}<a href='#' onClick={() => makeDefaultProc(proc)}>Als Standard festlegen</a>
                    </small>
                </li>
            )}
            <br/>
            Neuen Prozess importieren, im <a href='#' onClick={() => setAddingProcessVia('json')}>JSON</a> oder im
            {' '}<a href='#' onClick={() => setAddingProcessVia('bpmn')}>BPMN</a> Format.{' '}
            {addingProcessVia &&
                <input type="file" onChange={e => handleChange(e.target.files[0])}/>
            }
        </>
    );
}
