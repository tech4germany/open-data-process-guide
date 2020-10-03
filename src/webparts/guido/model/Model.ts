import * as config from './config.json';
import { Process } from "./Process";
import BpmnModdle from 'bpmn-moddle';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs/index";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields/list";
import "@pnp/sp/items/list";
import Utils from "./Utils";

const PROCESSES_LIST_NAME: string = 'guido-processes';
const PROCESS_JSON_FIELD_NAME: string = 'configJSON';
const CASES_LIST_NAME: string = 'guido-cases';

export class Model {

    /*
     One "process" consists of multiple "modules" that have "fields".
     Modules are connected in an ordered succession with parallel as well as serial sections. TODO
     Fields might have dependencies on other fields (in previous modules) and can be automatically filled. TODO
     An instantiated process we call "case" containing instantiated modules we call "tasks".
     */

    public lists: any = {};

    public getInitialProcesses(done) {
        this.initStorage(() => {
            this.loadProcessesFromStorage((procs: Process[]) => {
                done(procs);
            });
        });
        return null;
    }

    private initStorage = done => {
        if (Utils.isDevEnv()) {
            done();
        } else {
            this.initLists(done);
        }
    }

    private initLists = async(done) => {
        let procsListEnsure = await sp.web.lists.ensure(PROCESSES_LIST_NAME);
        let casesListEnsure = await sp.web.lists.ensure(CASES_LIST_NAME);
        this.lists = {
            procs: procsListEnsure.list,
            cases: casesListEnsure.list
        }
        if (procsListEnsure.created) {
            // list was just created
            procsListEnsure.list.fields.addText(PROCESS_JSON_FIELD_NAME).then(f => {
                // let promises: Promise<Process>[] = ...
                // this is to make sure we are waiting until all processes from config.json got added to the list before moving on
                Promise.all(config.processes.map(conf => this.importFromJSON(conf, null))).then(() => {
                    done();
                });
            });
        } else {
            // list already existed
            done();
        }
    }

    private loadProcessesFromStorage = done => {
        if (Utils.isDevEnv()) {
            // import processes defined in config.json
            Promise.all(config.processes.map(conf => this.importFromJSON(conf, null))).then(procs => {
                done(procs);
            });
        } else {
            // import processes from sharepoint list
            sp.web.lists.getByTitle(PROCESSES_LIST_NAME).items.get().then((items: any[]) => {
                Promise.all(items.map(item => this.importFromJSON(JSON.parse(item[PROCESS_JSON_FIELD_NAME]), item.ID))).then(procs => {
                    done(procs);
                });
            });
        }
    }

    public writeProcessToStorage = (proc: Process, resolve) => {
        if (Utils.isDevEnv()) {
            resolve(proc);
        } else {
            this.lists.procs.items.add({
                Title: proc.id,
                [PROCESS_JSON_FIELD_NAME]: JSON.stringify(proc.getJSONconfig())
            }).then(item => {
               proc.setListID(item.data.ID);
               resolve(proc);
            });
        }
    }

    public importFromJSON(conf: any, listID: number): Promise<Process> {
        return new Promise<Process>(resolve => {
            let process: Process = new Process(conf.id, conf.name, conf.description);
            process.setModules(conf.modules);
            if (listID) {
                process.setListID(listID);
                resolve(process);
            } else {
                this.writeProcessToStorage(process, resolve);
            }
        });
    }

    public importFromBPMN(xmlStr: string, fileName: string): Promise<Process> {
        const moddle = new BpmnModdle();
        return moddle.fromXML(xmlStr).then(parsed => {
            return new Promise<Process>(resolve => {
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
                    if (currentElement['$type'] !== 'bpmn:EndEvent') { // solve this nicer TODO
                        orderedTasks.push(currentElement);
                        // TODO
                        console.log(lanes[currentElement.inLane].name + ' is responsible for ' + currentElement.name);
                    }
                }
                // orderedTasks.pop(); // remove EndEvent

                let process: Process = new Process(fileName, fileName, '');
                process.setModules(orderedTasks.map(task => task.name));
                this.writeProcessToStorage(process, resolve);
            });
        });
    };

    public deleteProcessFromStorage = async(proc: Process) => {
        if (Utils.isDevEnv()) {
            // ?
        } else {
            await this.lists.procs.items.getById(proc.listID).delete();
        }
    }
}
