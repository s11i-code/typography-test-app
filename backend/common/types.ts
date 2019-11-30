export type Resolution = {
    width: number;
    height: number;
}

export interface Sitedata {
    siteID: string,
    imagePath: string;
    resolution: Resolution;
    elements: Element[];
}

export type Rect = {
    top: number,
    bottom: number,
    left: number,
    right: number,
    height: number,
    width: number,
}

export interface Element {
    id: string;
    rect: Rect;
    style: any;
    text: string;
    tagName: string;
    colorData: {
    }
}

export interface GetSiteRequestParams {
    resolutionIdx: number;
}

export interface EvaluateSiteRequestParams {
    siteID: string;
    resolution: Resolution;
    selectedElementIDs: string[];
    viewport: Resolution,
}


