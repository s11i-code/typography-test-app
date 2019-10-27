export type Resolution = {
    width: number;
    height: number;
}

export interface Sitedata {
    imagePath?: string;
    resolution?: Resolution;
    elements?: any[];
}