import * as config from './config.json';
import { Process } from "./Process";

export class Model {

    /*
     One "process" consists of multiple "modules" that have "fields".
     Modules are connected in an ordered succession with parallel as well as serial sections. TODO
     Fields might have dependencies on other fields (in previous modules) and can be automatically filled. TODO
     An instantiated process we call "case" containing instantiated modules we call "tasks".
     */

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
