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
import ActiveCase from "../view/ActiveCase";

export default function GuidoWebPart(props: IGuidoWebPartProps) {

    const [paramsParsed, setParamsParsed] = useState(null);
    const [model, setModel] = useState(null);

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

    const dev = () => {
        console.log("isDevEnv: ", Utils.isDevEnv());
        console.log("nanoid: ", nanoid(5));
        console.log(props.context);
        let title = props.context.pageContext.web.title;
        console.log(title, props.context.pageContext.user);
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <Fabric.PrimaryButton onClick={dev}>Dev</Fabric.PrimaryButton>
                <br/><br/>
                <span className={styles.title}>Welcome to {escape(props.description)}!</span>
                &nbsp;&nbsp;
                <br/><br/><br/>
                <ProcessDashboard model={model}/>
                <br/><hr/><br/>
                <CasesDashboard model={model}/>
                <br/><hr/><br/>
                <ActiveCase model={model}/>
                <br/>
            </div>
        </div>
    );
}
