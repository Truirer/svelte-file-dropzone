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

//for more information 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types

type MimeTypes =
    "audio/aac" |
    "application/x-abiword" |
    "image/apng" |
    "application/x-freearc" |
    "image/avif" |
    "video/x-msvideo" |
    "application/vnd.amazon.ebook" |
    "application/octet-stream" |
    "image/bmp" |
    "application/x-bzip" |
    "application/x-bzip2" |
    "application/x-cdf" |
    "application/x-csh" |
    "text/css" |
    "text/csv" |
    "application/msword" |
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" |
    "application/vnd.ms-fontobject" |
    "application/epub+zip" |
    "application/gzip." |
    "image/gif" |
    "text/html" |
    "image/vnd.microsoft.icon" |
    "text/calendar" |
    "application/java-archive" |
    "image/jpeg" |
    "text/javascript" |
    "application/json" |
    "application/ld+json" |
    "audio/midi, audio/x-midi" |
    "text/javascript" |
    "audio/mpeg" |
    "video/mp4" |
    "video/mpeg" |
    "application/vnd.apple.installer+xml" |
    "application/vnd.oasis.opendocument.presentation" |
    "application/vnd.oasis.opendocument.spreadsheet" |
    "application/vnd.oasis.opendocument.text" |
    "audio/ogg" |
    "video/ogg" |
    "application/ogg" |
    "audio/ogg" |
    "font/otf" |
    "image/png" |
    "application/pdf" |
    "application/x-httpd-php" |
    "application/vnd.ms-powerpoint" |
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" |
    "application/vnd.rar" |
    "application/rtf" |
    "application/x-sh" |
    "image/svg+xml" |
    "application/x-tar" |
    "image/tiff" |
    "video/mp2t" |
    "font/ttf" |
    "text/plain" |
    "application/vnd.visio" |
    "audio/wav" |
    "audio/webm" |
    "video/webm" |
    "image/webp" |
    "font/woff" |
    "font/woff2" |
    "application/xhtml+xml" |
    "application/vnd.ms-excel" |
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" |
    "application/xml" |
    "application/vnd.mozilla.xul+xml" |
    "application/zip." |
    "video/3gpp" |
    "audio/3gpp" |
    "video/3gpp2" |
    "audio/3gpp2" |
    "application/x-7z-compressed"

export type DropzoneProps = {
    accept?: MimeTypes[] | string[],
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