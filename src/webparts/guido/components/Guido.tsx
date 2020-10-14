import * as React from 'react';
import { useEffect, useRef, useState } from "react";
import styles from './Guido.module.scss';
import { IGuidoWebPartProps } from '../GuidoWebPart';
import { parse } from 'query-string';
import { Model } from "../model/Model";
import ProcessDashboard from "../view/ProcessDashboard";
import CasesDashboard from "../view/CasesDashboard";
import CaseView from "../view/CaseView";
import { SettingsObject } from "../model/SettingsObject";
import { Process } from "../model/Process";

export default function GuidoWebPart(props: IGuidoWebPartProps) {

    const [showProcessDashboard, setShowProcessDashboard] = useState(false);
    const settingsObject = useRef(null);
    const [defaultProcessId, setDefaultProcessId] = useState(null);
    const [urlParamsParsed, setUrlParamsParsed] = useState(null);
    const [model, setModel] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [cases, setCases] = useState([]);
    const [activeCase, setActiveCase] = useState(null);
    // incremented through edits in fields and next/back clicks, to force CaseDashboard to update the progress on the active case
    const [changeNotifs, setChangeNotifs] = useState(0);
    const [modelInitiated, setModelInitiated] = useState(false);

    useEffect(() => {
        if (!model) {
            let newModel: Model = new Model(props.context);
            setModel(newModel);
            settingsObject.current = new SettingsObject();
            newModel.initLists(settingsObject.current, () => {
                newModel.getInitialProcesses(procs => {
                    newModel.initSettings(settingsObject.current, procs[0].id).then(() => {
                        setDefaultProcessId(settingsObject.current.defaultProcessId);
                        setShowProcessDashboard(settingsObject.current.showProcessDashboard);
                        // if startCaseByEmail, the default process needs to be set, that's why this barrier
                        setModelInitiated(true);
                    });
                    setProcesses(procs);
                    // initStorage is done at this point
                    newModel.getInitialCases(procs, iniCases => {
                        setCases(iniCases);
                    });
                });
            });
        }
        if (modelInitiated && !urlParamsParsed) {
            let parsed = parse(location.search);
            console.log("URL params: ", parsed);
            setUrlParamsParsed(parsed);
            if (parsed['startCaseByEmail']) {
                onStartDefaultCase(parsed['startCaseByEmail'].toString());
            }
        }
    });

    const toggleShowProcessDashboard = () => {
        settingsObject.current.toggleShowProcessDashboard();
        model.updateSettingsInStorage(settingsObject.current).then(() => {
            setShowProcessDashboard(settingsObject.current.showProcessDashboard);
        });
    };

    // called from ProcessDashboard

    const onStartCase = (proc: Process, caseFolderNameViaEmail: string = null) => {
        model.newCaseFromProcess(proc, caseFolderNameViaEmail).then(caseObj => {
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

    const onDefaultProcessChange = procId => {
        settingsObject.current.defaultProcessId = procId;
        model.updateSettingsInStorage(settingsObject.current).then(() => {
            setDefaultProcessId(procId);
        });
    };

    // called from CasesDashboard

    const onContinueCase = caseObj => {
        setActiveCase(caseObj);
    };

    const onDeleteCase = caseObj => {
        if (activeCase === caseObj) {
            setActiveCase(null);
        }
        model.deleteCaseFromStorage(caseObj);
        setCases(cases.filter(c => c !== caseObj));
    };

    const onStartDefaultCase = (caseFolderNameViaEmail: string = null) => {
        if (!defaultProcessId) {
            console.log("No default process ID set, don't know from which process to start a case");
            return;
        }
        onStartCase(processes.filter(proc => proc.id === defaultProcessId)[0], caseFolderNameViaEmail);
    };

    // called from CaseView

    const stopEditing = () => {
        setActiveCase(null);
    };

    const onChangeNotify = () => {
        setChangeNotifs(changeNotifs + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                {/*<Fabric.PrimaryButton onClick={dev}>Dev</Fabric.PrimaryButton>
                <span className={styles.title}>Welcome to {escape(props.description)}!</span>*/}
                {showProcessDashboard &&
                    <>
                        <ProcessDashboard
                            model={model}
                            processes={processes}
                            onStartCase={proc => onStartCase(proc)}
                            onImportProcess={(type, fileName, content) => onImportProcess(type, fileName, content)}
                            onDeleteProcess={proc => onDeleteProcess(proc)}
                            defaultProcessId={defaultProcessId}
                            onDefaultProcessChange={procId => onDefaultProcessChange(procId)}
                        />
                        <br/>
                        <hr/>
                    </>
                }
                <a href='#' onClick={toggleShowProcessDashboard}>
                    Prozessübersicht {showProcessDashboard ? 'verstecken' : 'anzeigen'}
                </a><br/>
                <CasesDashboard
                    model={model}
                    cases={cases}
                    activeCase={activeCase}
                    changeNotifs={changeNotifs}
                    onContinueCase={caseObj => onContinueCase(caseObj)}
                    onDeleteCase={caseObj => onDeleteCase(caseObj)}
                    onStartDefaultCase={onStartDefaultCase}
                />
                <br/><hr/>
                <CaseView
                    model={model}
                    case={activeCase}
                    onChangeNotify={onChangeNotify}
                    stopEditing={stopEditing}
                />
                <br/>
            </div>
        </div>
    );
}
