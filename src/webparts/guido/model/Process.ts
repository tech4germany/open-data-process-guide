import {Module} from "./Module";

export class Process {

    public modules: Module[] = [];

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
        }
    }
}
