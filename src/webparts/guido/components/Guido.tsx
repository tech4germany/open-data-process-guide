import * as React from 'react';
import { useEffect, useState } from "react";
import styles from './Guido.module.scss';
import { IGuidoWebPartProps } from '../GuidoWebPart';
import { escape } from '@microsoft/sp-lodash-subset';
import { nanoid } from 'nanoid';
import { parse } from 'query-string';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import {Model} from "../model/Model";
import Case from "../view/Case";

export default function GuidoWebPart(props: IGuidoWebPartProps) {

    const [paramsParsed, setParamsParsed] = useState(null);
    const [model, setModel] = useState(null);
    const [addingProcessVia, setAddingProcessVia] = useState(null); // null, "json" or "bpmn"

    useEffect(() => {
        if (!paramsParsed) {
            let parsed = parse(location.search);
            console.log("URL params: ", parsed);
            setParamsParsed(parsed);
        }
        if (!model) {
            setModel(new Model());
        }
    });

    const listsTest = async() => {
        console.log(sp.web.lists);
        console.log(sp.web.lists.length);
        const listAddResult = await sp.web.lists.add("My new list");
    };

    const dev = () => {
        console.log("nanoid: ", nanoid(5));
        // listsTest();
        // <Fabric.PrimaryButton onClick={dev}>Dev</Fabric.PrimaryButton>
    };

    const handleChange = (file: File) => {
        let reader = new FileReader();
        reader.onload = e => {
            let content = reader.result.toString();
            if (addingProcessVia === 'json') {
                model.importFromJSON(JSON.parse(content));
            }
            if (addingProcessVia === 'bpmn') {
                model.importFromBPMN(content);
            }
            setAddingProcessVia(null);
        }
        reader.readAsText(file);
    }

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.column}>
                    <span className={styles.title}>Welcome to {escape(props.description)}!</span>
                    &nbsp;&nbsp;
                    <br/><br/><br/>
                    {model &&
                        <>
                            <b>Processes</b>:<br/>
                            {model.processes.map((proc, idx) => <li key={'proc_' + idx}>{proc.name}</li>)}
                            <br/>
                            Add a new one via <a href='#' onClick={() => setAddingProcessVia('json')}>JSON</a> or <a href='#' onClick={() => setAddingProcessVia('bpmn')}>BPMN</a>
                            <br/><br/>
                            {addingProcessVia &&
                                <input type="file" onChange={e => handleChange(e.target.files[0])}/>
                            }
                        </>
                    }
                    <hr/>
                    {/*model && <Case process={model.processes[0]}/>*/}
                </div>
            </div>
        </div>
    );
}
