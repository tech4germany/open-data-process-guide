import * as React from 'react';
import { DetailsList, Selection } from "office-ui-fabric-react/lib/DetailsList";
import Utils from "../model/Utils";

export interface ICasesListProps {
    filteredCases: any[];
}

export default function CasesList(props: ICasesListProps) {
    
    const buildTableItems = () => {
        return props.filteredCases
            .map((caseObj, idx) => {
                return {
                    caseId: caseObj.id,
                    title: caseObj.id, // TODO
                    startTime: Utils.getFormattedTime(caseObj.startTime),
                    progress: 'TODO'
                }
            });
    };

    const casesTableSelection = new Selection({
        onSelectionChanged: () => console.log(casesTableSelection.getSelection())
    });

    const casesTableColumns = [
        { key: 'col1', name: 'Titel', fieldName: 'title', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'col2', name: 'Erstellt am', fieldName: 'startTime', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'col3', name: 'Fortschritt', fieldName: 'progress', minWidth: 100, maxWidth: 200, isResizable: true },
    ];

    return (
        <DetailsList
            items={buildTableItems()}
            columns={casesTableColumns}
            selection={casesTableSelection}
        />
    );
}
