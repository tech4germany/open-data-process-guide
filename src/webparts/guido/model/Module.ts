import * as modulesConfig from './modules.json';

export class Module {
    public config: any;

    constructor(public id: string) {
        this.config = modulesConfig.modules[id];

        let fieldsUncompressed = {};
        let fieldKeys = Object.keys(this.config.fields);
        for (let i = 0; i < fieldKeys.length; i++) {
            let key = fieldKeys[i];
            let val = this.config.fields[key];
            if (key === 'ref') {
                fieldsUncompressed[val] = modulesConfig.fields[val];
            } else {
                fieldsUncompressed[key] = val;
            }
        }

        this.config.fields = fieldsUncompressed
    }

}
