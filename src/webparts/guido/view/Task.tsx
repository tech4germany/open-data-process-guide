import * as React from 'react';
import { useEffect, useState } from "react";
import {Module} from "../model/Module";
import Field from "./Field";

export interface ITaskProps {
    module: Module;
    onEdit: any;
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
                <b>{module.config.name}</b>
                <br/>
                {module.config.description}
                <br/><br/>
                {Object.keys(module.config.fields).map(fieldId =>
                    <Field
                        key={'field_' + fieldId}
                        details={module.config.fields[fieldId]}
                        onEdit={value => props.onEdit(fieldId, value)}
                    />)}
            </>
        )
    );
}
