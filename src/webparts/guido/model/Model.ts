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
        let process: Process = new Process(processConfig.id, processConfig.name);
        process.setModules(processConfig.modules);
        this.processes.push(process);
    }

    public importFromBPMN(xmlStr: string, fileName: string): void {
        const moddle = new BpmnModdle();
        moddle.fromXML(xmlStr).then(parsed => {
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
            this.processes.push(process);
            console.log(process);
        });
    };

}
