import * as React from 'react';
import { useEffect, useState } from "react";
import {Module} from "../model/Module";

export interface ITaskProps {
    module: Module;
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
            </>
        )
    );
}
