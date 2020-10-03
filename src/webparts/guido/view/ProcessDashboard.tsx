import * as React from 'react';
import { useState, useEffect } from "react";
import fileDownload from 'js-file-download';
import { Model } from "../model/Model";
import { Process } from "../model/Process";

export interface IProcessDashboardProps {
    model: Model;
    processes: Process[];
    onStartCase: any;
    onImportProcess: any;
    onDeleteProcess: any;
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
        }
        reader.readAsText(file);
    };

    const startCase = proc => {
        // TODO props.model.getProcessByID(procId)
    };

    const deleteProc = proc => {
        //setProcessIds(processIDs.filter(id => id !== procId));
        //props.model.deleteProcess(procId);
    };

    const downloadProc = proc => {
        //let jsonStr = JSON.stringify(props.model.getProcessByID(procId).getJSONconfig(), null, 4);
        //fileDownload(jsonStr, procId + '.json');
    };

    return (
        <>
            <b>Processes</b>:<br/>
            {props.processes.map((proc, idx) =>
                <li key={'proc_' + idx}>
                    {proc.name}
                    {' '}<a href='#' onClick={() => startCase(proc)}>start case</a>
                    {' '}<a href='#' onClick={() => deleteProc(proc)}>delete</a>
                    {' '}<a href='#' onClick={() => downloadProc(proc)}>download</a>
                </li>
            )}
            <br/>
            Import a new process via <a href='#' onClick={() => setAddingProcessVia('json')}>JSON</a> or
            {' '}<a href='#' onClick={() => setAddingProcessVia('bpmn')}>BPMN</a>
            {addingProcessVia &&
                <>
                    <br/><br/>
                    <input type="file" onChange={e => handleChange(e.target.files[0])}/>
                </>
            }
        </>
    );
}
