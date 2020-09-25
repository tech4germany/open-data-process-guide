import {Module} from "./Module";

export class Process {

    public id: string;
    public name: string;
    public modules: Module[] = [];

    constructor(public processConfig: any) {
        this.id = processConfig.id;
        this.name = processConfig.name;
        this.setModules(processConfig.modules);
    }

    public setModules(moduleIDs: string[]): void {
        this.modules = moduleIDs.map(id => new Module(id));
    }
}
