import sanitizeFilename from 'sanitize-filename';

import { Resolution } from "./types";

export const sites = ["https://github.com/satueveliina", "https://www.smartly.io/", "https://yle.fi/"];
export const resolutions: Resolution[] = [{width: 960, height: 800}, {width: 768, height: 1024}, {width: 375, height: 667}];

export function getS3FolderPath(site: string, resolution: Resolution): string {
    let path = "";
    if(resolution) {
        path =`${resolution.width}x${resolution.height}`;
    }
    if(site) {
        const cleanedSite = site.replace("http://", "").replace("https://", "");
        path =`${path}/${sanitizeFilename(cleanedSite)}`;

    }
    return path;
}

