import * as config from './config.json';
import { Process } from "./Process";

export class Model {

    public processes: Process[] = [];

    constructor() {
        let processIDs = Object.keys(config.processes);
        for (let i = 0; i < processIDs.length; i++) {
            let processConfig = config.processes[processIDs[i]];
            let process: Process = new Process(processConfig.name);
            process.setModules(processConfig.modules);
            this.processes.push(process);
        }
        console.log(this.processes);
    }

}
