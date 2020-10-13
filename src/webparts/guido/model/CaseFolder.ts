export class CaseFolder {

    public caseFiles: CaseFile[] = [];

    // ServerRelativeUrl + SharingLinkKind.OrganizationEdit
    constructor(public folderPath: string, public folderSharingLink: string) {}

    public addCaseFile(caseFile: CaseFile) {
        this.caseFiles.push(caseFile);
    }

    public getCaseFiles() {
        return this.caseFiles;
    }

}

export class CaseFile {
    constructor(
        public path: string, // ServerRelativeUrl
        public filename: string,
        public extension: string,
    ) {}
}
