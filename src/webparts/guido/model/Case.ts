import { Process } from "./Process";
import { nanoid } from 'nanoid';
import { CaseFolder } from "./CaseFolder";

export class Case {

    public id: string;
    public startTime: number;
    public process: Process;
    public listItemID: number = null;
    public step: number = 0;
    public values: any = {};
    public caseFolder: CaseFolder = null;

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

    public setValue(moduleId: string, fieldId: string, value: any) {
        this.values[moduleId][fieldId] = value;
    }

    public setCaseFolder(caseFolder: CaseFolder) {
        this.caseFolder = caseFolder;
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

    public getProgressStr(): string {
        let currentStep = this.step + 1;
        let totalSteps = this.process.modules.length;
        let totalFields = 0;
        let nonemptyFields = 0;
        Object.keys(this.values).map(moduleId => {
            Object.keys(this.values[moduleId]).map(fieldId => {
                totalFields ++;
                if (this.values[moduleId][fieldId]) {
                    nonemptyFields ++;
                }
            });
        });
        let progressPercentage = Math.round((nonemptyFields / totalFields) * 100);
        return progressPercentage + '% (' + nonemptyFields + '/' + totalFields + ' fields), currently in step ' + currentStep + '/' + totalSteps;
    }

    public setListItemID(listID: any) {
        this.listItemID = listID;
    }

    public setStep(newStep: number) {
        this.step = newStep;
    }
}
