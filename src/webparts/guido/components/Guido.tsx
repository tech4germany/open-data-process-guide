import * as React from 'react';
import { useEffect, useState } from "react";
import styles from './Guido.module.scss';
import { IGuidoWebPartProps } from '../GuidoWebPart';
import { escape } from '@microsoft/sp-lodash-subset';
import { nanoid } from 'nanoid';
import { parse } from 'query-string';
import { Model } from "../model/Model";
import ProcessDashboard from "../view/ProcessDashboard";
import CasesDashboard from "../view/CasesDashboard";
import * as Fabric from "office-ui-fabric-react";
import Utils from "../model/Utils";
import CaseView from "../view/CaseView";

export default function GuidoWebPart(props: IGuidoWebPartProps) {

    const [paramsParsed, setParamsParsed] = useState(null);
    const [model, setModel] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [cases, setCases] = useState([]);
    const [activeCase, setActiveCase] = useState(null);

    useEffect(() => {
        if (!paramsParsed) {
            let parsed = parse(location.search);
            // console.log("URL params: ", parsed);
            setParamsParsed(parsed);
        }
        if (!model) {
            let model: Model = new Model();
            setModel(model);
            model.getInitialProcesses(procs => {
                setProcesses(procs)
            });
            // TODO get initial cases
        }
    });

    const dev = () => {
        console.log("isDevEnv: ", Utils.isDevEnv());
        console.log("nanoid: ", nanoid(5));
        console.log(props.context);
        let title = props.context.pageContext.web.title;
        console.log(title, props.context.pageContext.user);
    };

    // called from ProcessDashboard

    const onStartCase = proc => {
        model.newCaseFromProcess(proc).then(caseObj => {
            setCases([...cases, caseObj]);
            setActiveCase(caseObj);
        });
    };

    const onImportProcess = (type, fileName, content) => {
        if (type === 'json') {
            model.importFromJSON(JSON.parse(content), null).then(proc => {
                setProcesses([...processes, proc]);
            });
        }
        if (type === 'bpmn') {
            model.importFromBPMN(content, fileName).then(proc => {
                setProcesses([...processes, proc]);
            });
        }
    };

    const onDeleteProcess = proc => {
        model.deleteProcessFromStorage(proc);
        setProcesses(processes.filter(p => p !== proc));
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                {/*<Fabric.PrimaryButton onClick={dev}>Dev</Fabric.PrimaryButton>
                <span className={styles.title}>Welcome to {escape(props.description)}!</span>*/}
                <ProcessDashboard
                    model={model}
                    processes={processes}
                    onStartCase={proc => onStartCase(proc)}
                    onImportProcess={(type, fileName, content) => onImportProcess(type, fileName, content)}
                    onDeleteProcess={proc => onDeleteProcess(proc)}
                />
                <br/><hr/>
                <CasesDashboard model={model} cases={cases}/>
                <br/><hr/>
                <CaseView model={model} case={activeCase}/>
                <br/>
            </div>
        </div>
    );
}
