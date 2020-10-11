export class FileAttachmentReq {
    base64File: any;
    fileExtension: string;
    fileName: string;
    fileSize: number;
    fileId: string;
    copyCount: number = 0;
    filePath: string;
}

