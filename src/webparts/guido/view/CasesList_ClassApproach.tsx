import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import Utils from "../model/Utils";

export interface IRenderInjections {
    items: any[];
    selectionOptions: string;
}

export interface IItem {
    key: number;
    name: string;
    value: number;
}

export interface ICasesListProps {
    filteredCases: any[];
}

// adopted from https://developer.microsoft.com/en-us/fluentui#/controls/web/detailslist/basic

export class CasesList extends React.Component<ICasesListProps, IRenderInjections> {
    constructor(props: ICasesListProps) {
        super(props);

        this.selection = new Selection({
            onSelectionChanged: () => this.setState({ selectionOptions: this.getSelectionOptions() }),
        });

        this.state = {
            items: [],
            selectionOptions: this.getSelectionOptions(),
        };
    }

    componentDidUpdate(nextProps) {
        if (this.state.items.length != nextProps.filteredCases.length) {
            let listItems = nextProps.props.filteredCases
                .map((caseObj, idx) => {
                    return {
                        caseId: caseObj.id,
                        title: caseObj.id, // TODO
                        startTime: Utils.getFormattedTime(caseObj.startTime),
                        progress: 'TODO'
                    }
                });
            this.setState({items: listItems});
        }
    }

    private selection: Selection;
    private _allItems: IItem[];

    private columns: IColumn[] = [
        { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'Value', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true },
    ];

    public render(): JSX.Element {
        const { items, selectionOptions } = this.state;

        return (
            <>
                <div>{selectionOptions}</div>
                {/* MarqueeSelection lets you select multiple items by holding down the mouse */}
                <MarqueeSelection selection={this.selection}>
                    <DetailsList
                        items={items}
                        columns={this.columns}
                        selection={this.selection}
                        onItemInvoked={() => alert('invoked')}
                    />
                </MarqueeSelection>
            </>
        );
    }

    private getSelectionOptions(): string {
        const count = this.selection.getSelectedCount();

        switch (count) {
            case 0:
                return 'No items selected';
            case 1:
                return '1 item selected: ' + (this.selection.getSelection()[0] as IItem).name;
            default:
                return `${count} items selected`;
        }
    }

}
