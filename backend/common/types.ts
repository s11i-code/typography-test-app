export type Resolution = {
    width: number;
    height: number;
}

export interface Sitedata {
    siteID: string,
    imagePath?: string;
    resolution?: Resolution;
    elements?: Element[];
}

type Rect = {
    top: number,
    bottom: number,
    left: number,
    right: number,
}

export interface Element {
    id: string,
    tagName: string,
    text: string,
    rect: Rect,
}

export interface EvaluateSiteRequestParams {
    siteID: string;
    resolution: Resolution;
    selectedElementIDs: string[];
}


