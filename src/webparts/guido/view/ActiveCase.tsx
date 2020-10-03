import * as React from 'react';
import { useState, useEffect } from "react";
import Case from "./Case";
import { IModelProps } from "./IModelProps";

export default function ActiveCase(props: IModelProps) {

    const [activeCase, setActiveCase] = useState(null); // a Process object

    useEffect(() => {});

    return (
        <>
            Active case
            <Case process={activeCase}/>
        </>
    );
}
