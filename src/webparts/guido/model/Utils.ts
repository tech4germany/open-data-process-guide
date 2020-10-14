import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import * as moment from "moment";

export default class Utils {

    public static isDevEnv(): boolean {
        return Environment.type === EnvironmentType.Local;
        // EnvironmentType.SharePoint, EnvironmentType.ClassicSharePoint
    }

    public static getFormattedTime(timestamp: number): any {
        return moment.unix(timestamp).calendar();
    }

    public static replaceAt = (str, idx, replacement) => {
        return str.substr(0, idx) + replacement + str.substr(idx + replacement.length);
    }

    // from https://stackoverflow.com/a/34064434
    public static htmlDecode(input) {
        let doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    public static parseHtmlJson(raw): any {
        return JSON.parse(this.htmlDecode(raw));
    }

    public static getBaseURL(): string {
        // https://opendataprocess.sharepoint.com/sites/Guido/_layouts/15/workbench.aspx
        return 'https://opendataprocess.sharepoint.com/sites/Guido';
    }
}
