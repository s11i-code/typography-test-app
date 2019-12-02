import { Resolution } from "./types";

export const DEMO_SITE = "https://master.d7s4am5xcgjzr.amplifyapp.com/demo";
export const isDemoSite = (site:string) => site === DEMO_SITE
export const sites = [
    DEMO_SITE,
    "https://www.wikipedia.org",
    "https://github.com/satueveliina",
    "https://stackoverflow.com",
    "https://www.smartly.io",
    "https://yle.fi/",
    "https://www.helsinki.fi/en/university/units-and-faculties",
    "https://www.reddit.com/search?q=tottenham&source=trending&type=link",
    "https://yle.fi/uutiset/osasto/news",
];

export const resolutions: Resolution[] = [
    {width: 300, height: 1200},
    {width: 400, height: 1200},
    {width: 500, height: 1200},
    {width: 700, height: 1200},
    {width: 800, height: 1200},
    {width: 1000, height: 1200},
    {width: 1500, height: 1200},
    {width: 1700, height: 1200},
    {width: 2000, height: 1200},
];

export function getS3FolderPath(site: string, resolution: Resolution): string {
    let path = "";
    if(resolution) {
        path =`${resolution.width}x${resolution.height}`;
    }
    if(site) {
        const cleanedSite = site.replace("http://", "").replace("https://", "").replace('/', '-').replace('?', '-').replace('&', '-');
        path =`${path}/${cleanedSite}`;
    }
    return path;
}