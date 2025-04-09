export type ErrorTypes = boolean | {
    message: string,
    code: "file-invalid-type" | "file-too-large" | "file-too-small" | "too-many-files"
} | null
