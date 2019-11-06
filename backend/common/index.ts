
import { Resolution } from "./types";

export const sites = [
    "https://master.d7s4am5xcgjzr.amplifyapp.com/demo",
    "https://github.com/satueveliina",
    "https://www.smartly.io/",
    "https://yle.fi/",
    "https://medium.com/",
];
export const resolutions: Resolution[] = [
    {width: 300, height: 1200},
    {width: 400, height: 1200},
    {width: 500, height: 1200},
    {width: 700, height: 1200},
    {width: 800, height: 1200},
    {width: 1000, height: 1200},
    {width: 1500, height: 1200},
];

export function getS3FolderPath(site: string, resolution: Resolution): string {
    let path = "";
    if(resolution) {
        path =`${resolution.width}x${resolution.height}`;
    }
    if(site) {
        const cleanedSite = site.replace("http://", "").replace("https://", "");
        path =`${path}/${extractHostname(cleanedSite)}`;
    }
    return path;
}

function extractHostname(url:string): string {
    let hostname:string;

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];  //find & remove port number
    hostname = hostname.split('?')[0];     //find & remove "?"

    return hostname;
}