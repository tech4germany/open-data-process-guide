import * as config from './config.json';

export class Module {
    public config: any;

    constructor(public id: string) {
        this.config = config.modules[id];

        let fieldsUncompressed = {};
        let fieldKeys = Object.keys(this.config.fields);
        for (let i = 0; i < fieldKeys.length; i++) {
            let key = fieldKeys[i];
            let val = this.config.fields[key];
            if (key === 'ref') {
                fieldsUncompressed[val] = config.fields[val];
            } else {
                fieldsUncompressed[key] = val;
            }
        }

        this.config.fields = fieldsUncompressed
    }

}
