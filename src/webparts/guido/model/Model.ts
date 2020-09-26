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

    // public processes: Process[] = [];

    constructor() {}

    public importFromConfig(): Process[] {
        // import processes defined in config.json
        return config.processes.map(processConfig => this.importFromJSON(processConfig));
    }

    public importFromJSON(processConfig: any): Process {
        let process: Process = new Process(processConfig.id, processConfig.name);
        process.setModules(processConfig.modules);
        return process;
    }

    public importFromBPMN(xmlStr: string, fileName: string): Promise<Process> {
        const moddle = new BpmnModdle();
        return moddle.fromXML(xmlStr).then(parsed => {
            let processEl = parsed.rootElement.rootElements[1]; // [0] is bpmn:Collaboration, [1] is bpmn:Process
            let lanesEl = processEl.laneSets[0].lanes;

            let elements = {};
            let startEvent;
            let lanes = {};
            lanesEl.map(laneEl => {
                lanes[laneEl.id] = laneEl;
                laneEl.flowNodeRef.map(el => {
                    el.inLane = laneEl.id;
                    elements[el.id] = el;
                    if (el['$type'] === 'bpmn:StartEvent') {
                        startEvent = el;
                    }
                });
            });

            let orderedTasks = [];
            let currentElement = startEvent;
            while (currentElement['$type'] !== 'bpmn:EndEvent') {
                let sequenceFlow = currentElement.outgoing[0]; // = "edge" = "arrow"
                currentElement = elements[sequenceFlow.targetRef.id];
                orderedTasks.push(currentElement);
            }
            orderedTasks.pop(); // remove EndEvent

            let process: Process = new Process(fileName, fileName);
            process.setModules(orderedTasks.map(task => task.name));
            return process;
        });
    };

}
