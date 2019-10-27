const sanitizeFilename = require('sanitize-filename');

const sites = ["https://github.com/satueveliina", "https://www.smartly.io/", "https://yle.fi/"];
const resolutions = [{width: 960, height: 800}, {width: 768, height: 1024}, {width: 375, height: 667}];
function getS3FolderPath(site, resolution) {
    let path;
    if(resolution) {
        path =`${resolution.width}x${resolution.height}`;
    }
    if(site) {
        const cleanedSite = site.replace("http://", "").replace("https://", "");
        path =`${path}/${sanitizeFilename(cleanedSite)}`;

    }
    return path;
}


exports.sites = sites;
exports.resolutions = resolutions;
exports.getS3FolderPath = getS3FolderPath;

