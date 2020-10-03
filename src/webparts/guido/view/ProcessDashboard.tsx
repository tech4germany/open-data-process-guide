import * as React from 'react';
import { useState, useEffect } from "react";
import fileDownload from 'js-file-download';
import { IModelProps } from "./IModelProps";

export default function ProcessDashboard(props: IModelProps) {

    const [processIDs, setProcessIds] = useState([]);
    const [addingProcessVia, setAddingProcessVia] = useState(null); // null, "json" or "bpmn"

    useEffect(() => {
        if (props.model && processIDs.length === 0) {
            setProcessIds(props.model.getProcessIDs());
        }
    });

    const handleChange = (file: File) => {
        let reader = new FileReader();
        reader.onload = e => {
            let content = reader.result.toString();
            if (addingProcessVia === 'json') {
                let procId = props.model.importFromJSON(JSON.parse(content), null);
                setProcessIds([...processIDs, procId]);
            }
            if (addingProcessVia === 'bpmn') {
                props.model.importFromBPMN(content, file.name).then(procId => {
                    setProcessIds([...processIDs, procId]);
                });
            }
            setAddingProcessVia(null);
        }
        reader.readAsText(file);
    };

    const startCase = procId => {
        // TODO props.model.getProcessByID(procId)
    };

    const deleteProc = procId => {
        setProcessIds(processIDs.filter(id => id !== procId));
        props.model.deleteProcess(procId);
    };

    const downloadProc = procId => {
        let jsonStr = JSON.stringify(props.model.getProcessByID(procId).getJSONconfig(), null, 4);
        fileDownload(jsonStr, procId + '.json');
    };

    return (
        props.model && <>
            <b>Processes</b>:<br/>
            {processIDs.map((procId, idx) =>
                <li key={'proc_' + idx}>
                    {props.model.getProcessByID(procId).name}
                    {' '}<a href='#' onClick={() => startCase(procId)}>start case</a>
                    {' '}<a href='#' onClick={() => deleteProc(procId)}>delete</a>
                    {' '}<a href='#' onClick={() => downloadProc(procId)}>download</a>
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
