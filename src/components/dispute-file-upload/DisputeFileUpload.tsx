import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {Button} from "@jobber/components/Button";
import { FormatFile } from "@jobber/components/FormatFile";
import { Select, Option } from "@jobber/components/Select";
import { Content } from "@jobber/components/Content";
import { Card } from "@jobber/components/Card";

export enum DisputeFileCategory {
    NONE_SELECTED = "None Selected",
    CLIENT_COMMUNICATION = "Client Communication",
    CLIENT_SIGNATURE = "Client Signature",
    PROOF_OF_SERVICE = "Proof of Service",
    RECEIPT = "Receipt",
    REFUND_POLICY = "Refund Policy",
    OTHER = "Other"
}
export interface DisputeFile {
    file: File
    category: DisputeFileCategory
}

export interface DisputeFileUploadProps {
    onDisputeFilesChange: (disputeFiles: DisputeFile[]) => void
}

export const DisputeFileUpload = (props: DisputeFileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [disputeFiles, setDisputeFiles] = useState<DisputeFile[]>([]);

    useEffect(() => {
        props.onDisputeFilesChange(disputeFiles);
    })
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const files = Array.from(fileList);
            const newDisputeFiles = files.map((file) => { return { file: file, category: DisputeFileCategory.NONE_SELECTED } });
            setDisputeFiles(disputeFiles.concat(newDisputeFiles));
        }
    };

    const onFileDelete = (file: File) => {
        setDisputeFiles(disputeFiles.filter((disputeFile) => disputeFile.file.name !== file.name));
    }

    const onCategoryChange = (file: File, category: DisputeFileCategory) => {
        const newDisputeFiles = disputeFiles.map((disputeFile) => {
            if (disputeFile.file.name === file.name) {
                return { file: disputeFile.file, category: category }
            }
            return disputeFile;
        });
        setDisputeFiles(newDisputeFiles);
    }

    return <div>
        <Card
            header={{
                title: 'Dispute File Upload'
            }}
        >
        </Card>
        <Content>
            <input
                style={{display: 'none'}}
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
            />
            <Button label="Upload Files" size="small" type="secondary" onClick={() => inputRef.current?.click()}/>
                {
                    disputeFiles.map((disputeFile, index) => {
                        return <UploadedFile
                            key={index}
                            file={disputeFile.file}
                            onDelete={() => onFileDelete(disputeFile.file)}
                            onCategoryChange={(category: DisputeFileCategory) => onCategoryChange(disputeFile.file, category)}
                        ></UploadedFile>
                    })
                }
        </Content>
    </div>

}

interface UploadFileProps {
    file: File
    onDelete: () => void
    onCategoryChange: (category: DisputeFileCategory) => void
}

const UploadedFile = (props: UploadFileProps) => {
    const values = Object.values(DisputeFileCategory);
    const onCategoryChange = (newValue: string) => {
        props.onCategoryChange(newValue as DisputeFileCategory)
    }

    return (
        <>
        <FormatFile
           file={{
               key: props.file.name,
               name: props.file.name,
               type: props.file.type,
               size: props.file.size,
               progress: 1,
               src(): Promise<string> {
                   return new Promise((resolve, reject) => {
                       resolve("unknown");
                   })
               }}}
           onDelete={props.onDelete}
        ></FormatFile>
            <Select placeholder={"Select a category"} onChange={onCategoryChange}>
                {
                    Object.keys(DisputeFileCategory).map((key, index: number) => {
                        return <Option key={key} value={values[index]}>{values[index]}</Option>
                    })
                }
            </Select>
        </>
    )
}