import * as config from './config.json';
import { Process } from "./Process";
import BpmnModdle from 'bpmn-moddle';

export class Model {

    /*
     One "process" consists of multiple "modules" that have "fields".
     Modules are connected in an ordered succession with parallel as well as serial sections. TODO
     Fields might have dependencies on other fields (in previous modules) and can be automatically filled. TODO
     An instantiated process we call "case" containing instantiated modules we call "tasks".
     */

    public processes: Process[] = [];

    constructor() {
        // import processes defined in config.json
        for (let i = 0; i < config.processes.length; i++) {
            this.importFromJSON(config.processes[i]);
        }
    }

    public importFromJSON(processConfig: any): void {
        let process: Process = new Process(processConfig);
        this.processes.push(process);
    }

    public importFromBPMN(xmlStr: string): void {
        this.BPMNfromXML(xmlStr);
    }

    public BPMNfromXML = async(xmlStr: string) => {
        const moddle = new BpmnModdle();
        const { rootElement: definitions } = await moddle.fromXML(xmlStr);
        let elements = definitions.rootElements[0].flowElements;
        console.log("elements", elements);
        // elements[0]['$type']
    };

}
