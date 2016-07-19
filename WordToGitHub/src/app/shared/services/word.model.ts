export interface IImage {
    id?: number,
    altTextTitle?: string,
    altTextDescription?: string,
    height?: number,
    hyperlink?: string,
    imageFormat?: string,
    lockAspectRatio?: boolean,
    width?: number,
    base64ImageSrc?: OfficeExtension.ClientResult<string>
}