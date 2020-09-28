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

    public processes: Process[] = []; // use map instead?

    constructor() {
        this.importFromConfig();
    }

    public getProcessByID(id: string): Process {
        return this.processes.filter(proc => proc.id === id)[0];
    }

    public getProcessIDs(): string[] {
        return this.processes.map(proc => proc.id);
    }

    public importFromConfig(): void {
        // import processes defined in config.json
        config.processes.map(processConfig => this.importFromJSON(processConfig));
    }

    public importFromJSON(processConfig: any): string {
        let process: Process = new Process(processConfig.id, processConfig.name);
        process.setModules(processConfig.modules);
        this.processes.push(process);
        return process.id;
    }

    public importFromBPMN(xmlStr: string, fileName: string): Promise<string> {
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
                if (currentElement['$type'] !== 'bpmn:EndEvent') { // TODO solve this nicer
                    orderedTasks.push(currentElement);
                    console.log(lanes[currentElement.inLane].name + ' is responsible for ' + currentElement.name);
                }
            }
            // orderedTasks.pop(); // remove EndEvent

            let process: Process = new Process(fileName, fileName);
            process.setModules(orderedTasks.map(task => task.name));
            this.processes.push(process);
            return process.id;
        });
    };

}
