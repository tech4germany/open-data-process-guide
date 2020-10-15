import { Process } from "./Process";
import { nanoid } from 'nanoid';
import { CaseFile, CaseFolder } from "./CaseFolder";
import { Specifications } from "./Specifications";
import Utils from "./Utils";

export class Case {

    public id: string;
    public startTime: number;
    public process: Process;
    public listItemID: number = null;
    public step: number = 0;
    public values: any = {};
    public caseFolder: CaseFolder = null;
    public isCompleted: boolean = false;

    constructor(public specifications: Specifications) {}

    public getTitle() {
        let titlesFieldVal = this.values['describe-dataset']['title'];
        if (titlesFieldVal) {
            return titlesFieldVal;
        }
        return this.id;
    }

    public getFormattedStartTime() {
        return Utils.getFormattedTime(this.startTime);
    }

    public initNewCase(process: Process) {
        this.process = process;
        // copy all fields from the modules over here to track their values here
        process.modules.map(module => {
            this.values[module.id] = {};
            Object.keys(module.config.fields).map(fieldId => {
                let fieldParams = module.config.fields[fieldId];
                let val = null;
                if (Object.keys(fieldParams).filter(p => p === 'prefill').length > 0) {
                    let prefill = fieldParams.prefill;
                    if (prefill.startsWith('$')) { // indicator for variable
                        // further distinguish where to source the value from?
                        val = this.specifications.config[prefill.split('.')[1]];
                    } else {
                        val = prefill;
                    }
                }
                this.values[module.id][fieldId] = val;
            });
            if (module.config.responsible) {
                // where decisions have to be made about claiming it yourself or notifying the external user
                this.values[module.id]['responsibleUsersStatus'] = 'undecided';
            }
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
        this.isCompleted = caseConf.isCompleted;
        let dataUploadModule = caseConf.values['data-upload'];
        if (dataUploadModule && dataUploadModule['uploader']) {
            let uploaderField = dataUploadModule['uploader'];
            this.setCaseFolder(new CaseFolder(uploaderField.folderPath, uploaderField.folderSharingLink));
            uploaderField.fileNames.map(fn => {
                this.caseFolder.addCaseFile(new CaseFile(uploaderField.folderPath + '/' + fn, fn, fn.split('.')[1]));
            });
        }
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
            values: this.values,
            isCompleted: this.isCompleted
        };
    }

    public getProgressStr(): string {
        if (this.isCompleted) {
            return 'Bereitstellung abgeschlossen';
        }
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
        return progressPercentage + '% (' + nonemptyFields + '/' + totalFields + ' Felder), momentan in Schritt ' + currentStep + '/' + totalSteps;
    }

    public setListItemID(listID: any) {
        this.listItemID = listID;
    }

    public setStep(newStep: number) {
        this.step = newStep;
    }

    public setCompleted() {
        this.isCompleted = true;
    }
}
