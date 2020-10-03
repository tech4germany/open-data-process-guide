import { Process } from "./Process";
import { nanoid } from 'nanoid';

export class Case {

    public id: String;
    public startTime: number;
    public process: Process;
    public listID: number = null;

    public initNewCase(process: Process) {
        this.process = process;
        this.id = process.id + '_' + nanoid(4);
        this.startTime = Date.now() / 1000;
    }

    public initExistingCase(caseConf: any, process: Process) {
        this.id = caseConf.id;
        this.startTime = caseConf.startTime;
        this.process = process;
    }

    public getJSONconfig(): any {
        return {
            id: this.id,
            processId: this.process.id,
            startTime: this.startTime
        }
    }

    public getProgress(): number {
        return 0;
    }

    public setListID(listID: any) {
        this.listID = listID;
    }
}
