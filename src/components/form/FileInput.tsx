"use client"

import * as ArkUi from "@ark-ui/react";
import React from "react";
import {Code0Input} from "./Input";
import {ValidationProps} from "./useForm";
import {ComponentProps, mergeComponentProps} from "../../utils";
import {InputLabel} from "./InputLabel";
import {InputDescription} from "./InputDescription";
import {InputMessage} from "./InputMessage";
import "./FileInput.style.scss"

export type FileInputProps = {
    title?: React.ReactNode
    description?: React.ReactNode
} & Code0Input & ValidationProps<ArkUi.FileUploadFileChangeDetails> & ArkUi.FileUploadRootProps

export type FileInputDropzoneProps = ComponentProps & ArkUi.FileUploadDropzoneProps
export type FileInputTriggerProps = ComponentProps & ArkUi.FileUploadTriggerProps
export type FileInputItemGroupProps = ComponentProps & ArkUi.FileUploadItemGroupProps
export type FileInputItemProps = ComponentProps & ArkUi.FileUploadItemProps
export type FileInputItemPreviewProps = ComponentProps & ArkUi.FileUploadItemPreviewProps
export type FileInputItemPreviewImageProps = ComponentProps & ArkUi.FileUploadItemPreviewImageProps
export type FileInputItemNameProps = ComponentProps & ArkUi.FileUploadItemNameProps
export type FileInputItemSizeTextProps = ComponentProps & ArkUi.FileUploadItemSizeTextProps
export type FileInputItemDeleteTriggerProps = ComponentProps & ArkUi.FileUploadItemDeleteTriggerProps
export type FileInputHiddenInputProps = ComponentProps & ArkUi.FileUploadHiddenInputProps
export type FileInputContextProps = ArkUi.FileUploadContextProps


export const FileInput: React.FC<FileInputProps> = (props) => {

    const {title, description, formValidation, children, ...rest} = props;

    return <ArkUi.FileUploadRoot {...mergeComponentProps("file-input", {
        ...rest, onFileChange: (value: ArkUi.FileUploadFileChangeDetails) => {
            console.log(value)
            formValidation?.setValue?.(value)
            setTimeout(() => rest.onFileChange?.(value), 1000)
        }
    }) as FileInputProps}>
        {title && <InputLabel>{title}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}

        {children}

        {!formValidation?.valid && formValidation?.notValidMessage && (
            <InputMessage>{formValidation.notValidMessage}</InputMessage>
        )}
    </ArkUi.FileUploadRoot>
}

export const FileInputDropzone: React.FC<FileInputDropzoneProps> = (props) => {
    return <ArkUi.FileUploadDropzone {...mergeComponentProps("file-input__dropzone", props)}/>
}

export const FileInputTrigger: React.FC<FileInputTriggerProps> = (props) => {
    return <ArkUi.FileUploadTrigger {...mergeComponentProps("file-input__trigger", props)}/>
}

export const FileInputItemGroup: React.FC<FileInputItemGroupProps> = (props) => {
    return <ArkUi.FileUploadItemGroup {...mergeComponentProps("file-input__item-group", props)}/>
}

export const FileInputItem: React.FC<FileInputItemProps> = (props) => {
    return <ArkUi.FileUploadItem {...mergeComponentProps("file-input__item", props) as FileInputItemProps}/>
}

export const FileInputItemPreview: React.FC<FileInputItemPreviewProps> = (props) => {
    return <ArkUi.FileUploadItemPreview {...mergeComponentProps("file-input__item-preview", props)}/>
}

export const FileInputItemPreviewImage: React.FC<FileInputItemPreviewImageProps> = (props) => {
    return <ArkUi.FileUploadItemPreviewImage {...mergeComponentProps("file-input__item-preview-image", props)}/>
}

export const FileInputItemName: React.FC<FileInputItemNameProps> = (props) => {
    return <ArkUi.FileUploadItemName {...mergeComponentProps("file-input__item-name", props)}/>
}

export const FileInputItemSizeText: React.FC<FileInputItemSizeTextProps> = (props) => {
    return <ArkUi.FileUploadItemSizeText {...mergeComponentProps("file-input__item-size-text", props)}/>
}

export const FileInputItemDeleteTrigger: React.FC<FileInputItemDeleteTriggerProps> = (props) => {
    return <ArkUi.FileUploadItemDeleteTrigger {...mergeComponentProps("file-input__item-delete-trigger", props)}/>
}

export const FileInputHiddenInput: React.FC<FileInputHiddenInputProps> = (props) => {
    return <ArkUi.FileUploadHiddenInput {...mergeComponentProps("file-input__hidden-input", props)}/>
}

export const FileInputContext: React.FC<FileInputContextProps> = (props) => {
    return <ArkUi.FileUploadContext {...props}/>
}

