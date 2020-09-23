import {Module} from "./Module";

export class Process {

    public modules: Module[] = [];

    constructor(public name: string) {}

    public setModules(moduleIDs: string[]): void {
        this.modules = moduleIDs.map(id => new Module(id));
    }
}