import { Process } from "./Process";
import { nanoid } from 'nanoid';

export class Case {

    public id: String;
    public startTime: number;
    public process: Process;
    public listID: number = null;
    public step: number = 0;
    public values: any = {};

    public initNewCase(process: Process) {
        this.process = process;
        // copy all fields from the modules over here to track their values here
        process.modules.map(module => {
            this.values[module.id] = {};
            Object.keys(module.config.fields).map(fieldId => {
                this.values[module.id][fieldId] = null;
            });
        });
        this.id = process.id + '_' + nanoid(4);
        this.startTime = Date.now() / 1000;
    }

    public initExistingCase(caseConf: any, process: Process) {
        this.id = caseConf.id;
        this.startTime = caseConf.startTime;
        this.process = process;
        this.step = caseConf.step;
        this.values = caseConf.values;
    }

    public getJSONconfig(): any {
        return {
            id: this.id,
            processId: this.process.id,
            startTime: this.startTime,
            step: this.step,
            values: this.values
        }
    }

    public getProgress(): number {
        return 0;
    }

    public setListID(listID: any) {
        this.listID = listID;
    }
}
