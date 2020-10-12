export class SettingsObject {

    public defaultProcessId: string = null;
    public showProcessDashboard: boolean = false;

    public listItemID: string = null;

    constructor() {}

    public setDefaultProcessId(defaultProcessId: string) {
        this.defaultProcessId = defaultProcessId;
    }

    public toggleShowProcessDashboard() {
        this.showProcessDashboard = !this.showProcessDashboard;
    }

    public getJSONconfig(): any {
        return {
            defaultProcessId: this.defaultProcessId,
            showProcessDashboard: this.showProcessDashboard
        };
    }

    public setFromJSON(json: any) {
        this.defaultProcessId = json.defaultProcessId;
        this.showProcessDashboard = json.showProcessDashboard;
    }

    public setListItemID(ID: any) {
        this.listItemID = ID;
    }

}
