import * as React from 'react';
import { useEffect, useState } from "react";
import styles from './Guido.module.scss';
import { IGuidoWebPartProps } from '../GuidoWebPart';
import { escape } from '@microsoft/sp-lodash-subset';
import * as Fabric from 'office-ui-fabric-react';
import { nanoid } from 'nanoid';
import { parse } from 'query-string';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import TestComponent from './TestComponent';

export default function GuidoWebPart(props: IGuidoWebPartProps) {

    const [paramsParsed, setParamsParsed] = useState(null);

    useEffect(() => {
        if (!paramsParsed) {
            let parsed = parse(location.search);
            console.log("URL params: ", parsed);
            setParamsParsed(parsed);
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
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.column}>
                    <span className={styles.title}>Welcome to SharePoint!</span>
                    <p>Customize SharePoint experiences using Web Parts.</p>
                    <p>{escape(props.description)}</p>
                    <Fabric.PrimaryButton onClick={dev}>Dev</Fabric.PrimaryButton>
                    <br/>
                    <TestComponent/>
                </div>
            </div>
        </div>
    );
}
