import * as React from 'react';
import { useState, useEffect } from "react";
import { Model } from "../model/Model";

export interface ICaseDashboardProps {
    model: Model;
    cases: any[];
}

export default function CasesDashboard(props: ICaseDashboardProps) {

    useEffect(() => {});

    return (
        <>
            Open Cases | Closed Cases | Start a new case
        </>
    );
}
