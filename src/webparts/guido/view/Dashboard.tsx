import * as React from 'react';
import { useState, useEffect } from "react";
import {Model} from "../model/Model";
import Case from "./Case";

export interface IDashboardProps {
    model: Model;
}

export default function Dashboard(props: IDashboardProps) {

    const [processIDs, setProcessIds] = useState([]);
    const [addingProcessVia, setAddingProcessVia] = useState(null); // null, "json" or "bpmn"
    const [activeCase, setActiveCase] = useState(null); // a Process object

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
                let procId = props.model.importFromJSON(JSON.parse(content), true);
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
        setActiveCase(props.model.getProcessByID(procId));
    };

    return (
        props.model && <>
            <b>Processes</b>:<br/>
            {processIDs.map((procId, idx) =>
                <li key={'proc_' + idx}>{props.model.getProcessByID(procId).name} <a href='#' onClick={() => startCase(procId)}>start case</a></li>)
            }
            <br/>
            Add a new one via <a href='#' onClick={() => setAddingProcessVia('json')}>JSON</a> or
            {' '}<a href='#' onClick={() => setAddingProcessVia('bpmn')}>BPMN</a>
            <br/><br/>
            {addingProcessVia &&
                <input type="file" onChange={e => handleChange(e.target.files[0])}/>
            }
            {activeCase &&
                <>
                    <br/>
                    <hr/>
                    <br/>
                    <Case process={activeCase}/>
                </>
            }
        </>
    );
}
