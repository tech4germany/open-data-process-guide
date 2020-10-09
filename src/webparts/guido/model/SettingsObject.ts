export class SettingsObject {

    public defaultProcessId: string = null;
    public listItemID: string = null;

    constructor() {}

    public setDefaultProcessId(defaultProcessId: string) {
        this.defaultProcessId = defaultProcessId;
    }

    public getJSONconfig(): any {
        return {
            defaultProcessId: this.defaultProcessId
        }
    }

    public setFromJSON(json: any) {
        this.defaultProcessId = json.defaultProcessId;
    }

    public setListItemID(ID: any) {
        this.listItemID = ID;
    }

}
