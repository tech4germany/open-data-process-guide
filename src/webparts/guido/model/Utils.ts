import { Environment, EnvironmentType } from "@microsoft/sp-core-library";

export default class Utils {

    public static isDevEnv(): boolean {
        return Environment.type === EnvironmentType.Local;
        // EnvironmentType.SharePoint, EnvironmentType.ClassicSharePoint
    }
}
