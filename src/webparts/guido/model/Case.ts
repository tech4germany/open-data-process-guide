import { Process } from "./Process";
import { nanoid } from 'nanoid';

export class Case {

    public id: String;
    public startTime: number;

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
}
