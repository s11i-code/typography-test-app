const getContrast = require("get-contrast");
const fs = require("fs");
const puppeteer = require("puppeteer");
const sanitizeFilename = require("sanitize-filename");

const sites = ["https://github.com/satueveliina", "https://www.smartly.io/", "https://yle.fi/"];
const resolutions = [{width: 960, height: 800}, {width: 375, height: 900}, {width: 375, height: 450}];
const typographicElements = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "a"];
// tslint:disable: no-console

// aws s3 sync backend/tmp/ s3://typography-test-app-sites  --profile satu-personal-cli --acl public-read
function isInViewport(bounding) {
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function getFolderPath(site, resolution) {
    const cleanedSite = site.replace("http://", "").replace("https://", "");

    return `tmp/${sanitizeFilename(cleanedSite)}/${resolution}`;
}
async function writeJSON(path, data) {
    const jsonString = JSON.stringify(data);
    return fs.promises.mkdir(path, { recursive: true }, (err) => {
        if (err) {
            console.log("Error while creating the folder", err);
            return;
        }
        fs.writeFile(`${path}/data.json`, jsonString, function(err) {
            if (err) {
                console.log("Error writing file", err);
            }
        });
    });
}

async function scrapeSites() {
    const browser = await puppeteer.launch();
    await Promise.all(sites.map(async (site) => {
        return scrapeSite(site, browser);
    }));
    await browser.close();
}

// return await page.screenshot({
//     path: 'element.png',
//         clip: {
//         x: rect.left - padding,
//         y: rect.top - padding,
//         width: rect.width + padding * 2,
//         height: rect.height + padding * 2
//         }
//     });
// }
//const {x, y, width, height} = rect;
//return {left: x, top: y, width, height, id: element.id};

//    (async () => {  })();

scrapeSites();

async function scrapeSite(site, browser) {
    const page = await browser.newPage();
    await page.exposeFunction("writeJSON", writeJSON);
    await page.exposeFunction("getContrast", getContrast);
    await page.exposeFunction("isInViewport", isInViewport);
    await page.exposeFunction("getFolderPath", getFolderPath);

    // use reduce to execute loop sequentially
    return resolutions.reduce( async (previousPromise, resolution) => {
        await previousPromise;

        const path =  getFolderPath(site, `${resolution.width}x${resolution.height}`);
        await page.goto(site, {waitUntil: "networkidle2"});
        await page.setViewport({
            ...resolution,
            deviceScaleFactor: 1,
        });
        await processDOMElements(typographicElements, path, 16);
        return await page.screenshot({ path: `${path}/image.png`});
      }, Promise.resolve());

    async function processDOMElements(selector, path, padding = 0) {
        const data = await page.evaluate(selector => {
            const elements = document.querySelectorAll(selector);
            const parsed = [...elements].map(element => {
                const rect = element.getBoundingClientRect();
                const styles = window.getComputedStyle(element);
                const text = element.textContent.trim();
                const tagName = element.tagName;
                const { fontWeight, fontSize, color, backgroundColor } = styles;

                return   {
                    text,
                    rect,
                    color,
                    tagName,
                    backgroundColor,
                    fontSize: parseFloat(fontSize),
                    fontWeight: parseFloat(fontWeight),
                    isInViewport: isInViewport(rect),
                    contrast: getContrast(backgroundColor, color),
                };

            });
            return parsed;

        }, selector);
        await writeJSON(path, data);

    }
}

