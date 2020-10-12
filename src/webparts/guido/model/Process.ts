import {Module} from "./Module";

export class Process {

    public modules: Module[] = [];
    // if lists are used as storage, this is the ID of this process there
    public listID: number = null;

    constructor(public id: string, public name: string, public description: string) {}

    public setModules(moduleIDs: string[]): void {
        this.modules = moduleIDs.map(id => new Module(id));
    }

    public getJSONconfig(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            modules: this.modules.map(m => m.id)
        };
    }

    public setListItemID(listID: any) {
        this.listID = listID;
    }
}
