import * as config from './config.json';
import { Process } from "./Process";
import BpmnModdle from 'bpmn-moddle';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs/index";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields/list";
import "@pnp/sp/items/list";

export class Model {

    /*
     One "process" consists of multiple "modules" that have "fields".
     Modules are connected in an ordered succession with parallel as well as serial sections. TODO
     Fields might have dependencies on other fields (in previous modules) and can be automatically filled. TODO
     An instantiated process we call "case" containing instantiated modules we call "tasks".
     */

    public processes: Process[] = []; // use map instead?
    public lists: any = {};

    constructor() {
        this.initLists();
    }

    private initLists = async() => {
        const procsListEnsure = await sp.web.lists.ensure("guido-processes");
        const casesListEnsure = await sp.web.lists.ensure("guido-cases");
        if (procsListEnsure.created) {
            // list was just created --> write processes from config.json there
            procsListEnsure.list.fields.addText("configJSON").then(f => {
                this.importFromConfig();
            });
        } else {
            // list already existed --> import processes
            sp.web.lists.getByTitle("guido-processes").items.get().then((items: any[]) => {
                items.map(item => this.importFromJSON(JSON.parse(item.configJSON), false));
            });
        }
        this.lists = {
            procs: procsListEnsure.list,
            cases: casesListEnsure.list
        }
    }

    public addProcessToList = async(proc: Process) => {
        await this.lists.procs.items.add({
            Title: proc.id,
            configJSON: JSON.stringify(proc.getJSONconfig())
        });
    }

    public getProcessByID(id: string): Process {
        return this.processes.filter(proc => proc.id === id)[0];
    }

    public getProcessIDs(): string[] {
        return this.processes.map(proc => proc.id);
    }

    public importFromConfig(): void {
        // import processes defined in config.json
        config.processes.map(processConfig => this.importFromJSON(processConfig, true));
    }

    public importFromJSON(processConfig: any, addToList: boolean): string {
        let process: Process = new Process(processConfig.id, processConfig.name, processConfig.description);
        process.setModules(processConfig.modules);
        this.processes.push(process);
        if (addToList) {
            this.addProcessToList(process);
        }
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

            let process: Process = new Process(fileName, fileName, '');
            process.setModules(orderedTasks.map(task => task.name));
            this.processes.push(process);
            this.addProcessToList(process);
            return process.id;
        });
    };

}
