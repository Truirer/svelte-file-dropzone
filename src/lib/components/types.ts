import type { ErrorTypes } from "$lib/utils/types"
import type { Snippet } from "svelte"

export type RejectedFile = { file: File, errors: ErrorTypes[] }
export type DropzoneStateProps = {
    isFocused: boolean,
    isFileDialogActive: boolean,
    isDragActive: boolean,
    isDragAccept: boolean,
    isDragReject: boolean,
    draggedFiles: File[],
    acceptedFiles: File[],
    fileRejections: RejectedFile[]
}

export type DropzoneProps = {
    accept?: string[],
    disabled?: boolean,
    getFilesFromEvent?: (event: Event | any) => Promise<File[]>,
    maxSize?: number,
    minSize?: number,
    multiple?: boolean,
    preventDropOnDocument?: boolean,
    noClick?: boolean,
    noKeyboard?: boolean,
    noDrag?: boolean,
    noDragEventsBubbling?: boolean,
    containerClasses?: string,
    containerStyles?: string,
    disableDefaultStyles?: boolean,
    name?: string,
    inputElement?: HTMLInputElement,
    required?: boolean,
    children?: Snippet
}