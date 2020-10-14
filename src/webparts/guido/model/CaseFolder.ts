export class CaseFolder {

    public caseFiles: CaseFile[] = [];

    // ServerRelativeUrl + SharingLinkKind.OrganizationEdit
    constructor(public folderPath: string, public folderSharingLink: string) {}

    public getFolderName(): string {
        let split = this.folderPath.split('/');
        return split[split.length - 1];
    }

    public addCaseFile(caseFile: CaseFile) {
        this.caseFiles.push(caseFile);
    }

    public getCaseFiles() {
        return this.caseFiles;
    }

    public getJSONconfig(): any {
        return {
            folderPath: this.folderPath,
            folderSharingLink: this.folderSharingLink,
            fileNames: this.caseFiles.map(cf => cf.filename)
        }
    }
}

export class CaseFile {
    constructor(
        public path: string, // ServerRelativeUrl
        public filename: string,
        public extension: string,
    ) {}
}
