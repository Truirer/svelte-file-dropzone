import type { ErrorTypes } from "$lib/utils/types"
import type { Snippet } from "svelte"
import type { ChangeEventHandler, EventHandler } from "svelte/elements"

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

export type FileDropResult = {
    acceptedFiles: File[],
    fileRejections: RejectedFile[],
    event: DragEvent | Event
}
export type FileDropRejectedResult = {
    fileRejections: RejectedFile[],
    event: DragEvent | Event
}
export type FileDropAcceptedResult = {
    acceptedFiles: File[],
    event: DragEvent | Event
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
    children?: Snippet,
    onDragenter?: EventHandler<DragEvent>,
    onDragover?: EventHandler<DragEvent>,
    onDragleave?: EventHandler<DragEvent>,
    onFiledropped?: (event: DragEvent | Event) => void,
    onDrop?: (data: FileDropResult) => void,
    onDroprejected?: (data: FileDropRejectedResult) => void
    onDropaccepted?: (data: FileDropAcceptedResult) => void
    onFiledialogcancel?: () => void
}