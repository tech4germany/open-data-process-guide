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
}
