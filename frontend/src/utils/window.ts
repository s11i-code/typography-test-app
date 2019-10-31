// to prevent build errors in gatsby:
export const isBuilding: () => boolean = () => typeof(window) === "undefined";

// tslint:disable-next-line: max-line-length
export const getWindowWidth = (): number => {
    if (isBuilding()) {
        return 0;
    }
    // tslint:disable-next-line: max-line-length
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};
