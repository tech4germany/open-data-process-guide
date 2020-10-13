import * as React from 'react';
import { useEffect, useState } from "react";
import { Model } from "../model/Model";
import { Case } from "../model/Case";

export interface IUploadFilesFieldProps {
    model: Model;
    case: Case;
    onEdit: any;
}

export default function UploadFilesField(props: IUploadFilesFieldProps) {

    const [caseFileNames, setCaseFileNames] = useState([]);

    useEffect(() => {
        updateCaseFileNames();
    }, []);

    const updateCaseFileNames = () => {
        if (props.case && props.case.caseFolder) { // running locally, this is null
            setCaseFileNames(props.case.caseFolder.getCaseFiles().map(cf => cf.filename));
        }
    };

    const handleFileUploads = (fileList: FileList) => {
        props.model.uploadFilesToCase(props.case, fileList).then(() => {
            props.onEdit(props.case.caseFolder.getJSONconfig());
            updateCaseFileNames();
        });
    };

    return (
        <>
            <br/>
            <input type="file" multiple onChange={e => handleFileUploads(e.target.files)}/>
            <br/><br/>
            {caseFileNames.map(name =>
                <a href={props.case.caseFolder.folderSharingLink} target="_blank">
                    <span>{name}</span>{' '}
                </a>
            )}
        </>
    );
}
