import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'GuidoWebPartStrings';
import Guido from './components/Guido';
import { IGuidoProps } from './components/IGuidoProps';
import { setup as pnpSetup } from "@pnp/common";

export interface IGuidoWebPartProps {
    description: string;
    context: any;
}

export default class GuidoWebPart extends BaseClientSideWebPart<IGuidoWebPartProps> {

    // via https://pnp.github.io/pnpjs/getting-started/
    protected onInit(): Promise<void> {
        return super.onInit().then(_ => {
            pnpSetup({
                spfxContext: this.context
            });
        });
    }

    public render(): void {
        const element: React.ReactElement<IGuidoProps> = React.createElement(
            Guido,
            {
                description: this.properties.description,
                context: this.context
            }
        );

        ReactDom.render(element, this.domElement);
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
