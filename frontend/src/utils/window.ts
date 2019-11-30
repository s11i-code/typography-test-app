// to prevent build errors in gatsby:
export const buildIsOngoing: () => boolean = () => typeof(window) === "undefined";

export const getViewportWidth = (): number => {
    if (buildIsOngoing()) {
        return 0;
    }
    // tslint:disable-next-line: max-line-length
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

export const getViewportHeight = (): number => {
    if (buildIsOngoing()) {
        return 0;
    }
    // tslint:disable-next-line: max-line-length
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};
