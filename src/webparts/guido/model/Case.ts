import { Process } from "./Process";
import { nanoid } from 'nanoid';

export class Case {

    public id: String;
    public startTime: number;
    public listID: number = null;

    constructor(public process: Process) {
        this.id = process.id + '_' + nanoid(4);
        this.startTime = Date.now() / 1000;
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
