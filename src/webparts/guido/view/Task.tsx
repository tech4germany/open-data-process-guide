import * as React from 'react';
import { useEffect, useState } from "react";
import { Module } from "../model/Module";
import Field from "./Field";
import styles from "../components/Guido.module.scss";

export interface ITaskProps {
    module: Module;
    onEdit: any;
    initialValues: any;
    caseId: string;
    step: number
}

export default function Task(props: ITaskProps) {

    const [module, setModule] = useState(null);

    useEffect(() => {
        if (props.module !== module) {
            setModule(props.module);
        }
    });

    return (
       module &&  (
            <>
                <span className={styles.subtitle}>{'Schritt ' + props.step + ' - ' + module.config.name}</span>
                <br/><br/>
                {module.config.description}
                <br/><br/>
                {Object.keys(module.config.fields).map(fieldId =>
                    <Field
                        key={'case-' + props.caseId + '_module-' + module.id + '_field-' + fieldId}
                        details={module.config.fields[fieldId]}
                        onEdit={value => props.onEdit(fieldId, value)}
                        initialValue={props.initialValues[fieldId]}
                    />)}
            </>
        )
    );
}
