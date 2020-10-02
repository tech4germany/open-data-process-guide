import * as React from 'react';
import { useEffect, useState } from "react";
import styles from './Guido.module.scss';
import { IGuidoWebPartProps } from '../GuidoWebPart';
import { escape } from '@microsoft/sp-lodash-subset';
import { nanoid } from 'nanoid';
import { parse } from 'query-string';
import { Model } from "../model/Model";
import Dashboard from "../view/Dashboard";
import * as Fabric from "office-ui-fabric-react";
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

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

    const isDevEnv = (): boolean => {
        return Environment.type === EnvironmentType.Local;
        // EnvironmentType.SharePoint, EnvironmentType.ClassicSharePoint
    };

    const listsTest = async() => {
        const list = sp.web.lists.getByTitle("listy");
        const allItems: any[] = await list.items.getAll();
        console.log(allItems);
    }

    const dev = () => {
        console.log("isDevEnv: ", isDevEnv());
        console.log("nanoid: ", nanoid(5));
        console.log(props.context);
        let title = props.context.pageContext.web.title;
        console.log(title, props.context.pageContext.user);
        listsTest();
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <Fabric.PrimaryButton onClick={dev}>Dev</Fabric.PrimaryButton>
                <br/><br/>
                <span className={styles.title}>Welcome to {escape(props.description)}!</span>
                &nbsp;&nbsp;
                <br/><br/><br/>
                <Dashboard model={model}/>
            </div>
        </div>
    );
}
