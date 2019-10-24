const sanitizeFilename = require('sanitize-filename');

const sites = ["https://github.com/satueveliina", "https://www.smartly.io/", "https://yle.fi/"];
const resolutions = [{width: 960, height: 800}, {width: 375, height: 900}, {width: 375, height: 450}];
function getFolderPath(site, resolution) {
    const cleanedSite = site.replace("http://", "").replace("https://", "");
    return `tmp/${sanitizeFilename(cleanedSite)}/${resolution}`;
}


exports.sites = sites;
exports.resolutions = resolutions;
exports.getFolderPath = getFolderPath;

