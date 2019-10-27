import contrast from "get-contrast";
import fs from "fs";
import puppeteer from "puppeteer";
import { sites, resolutions, getS3FolderPath } from '../backend/common';
import { Resolution } from "../backend/common/types";

const typographicElements = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "button"];

function isInViewport(bounding, resolution: Resolution) {
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (resolution.height) &&
        bounding.right <= (resolution.width)
    );
}

function getContrast(color1:string, color2:string): number {
    return contrast.ratio(color1, color2, {ignoreAlpha: true})
}

async function writeJSON(path: string, data:any) {
    const jsonString = JSON.stringify(data);
    const syncFolderPath = `tmp/${path}`
    return fs.mkdir(syncFolderPath, { recursive: true }, (err) => {
        if (err) {
            console.log("Error while creating the folder", err);
            return;
        }
        fs.writeFile(`${syncFolderPath}/data.json`, jsonString, function(err) {
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

scrapeSites();

async function scrapeSite(site:string, browser: any) {
    const page = await browser.newPage();
    await page.exposeFunction("log", console.log);


    // use reduce here to execute loop sequentially
    return resolutions.reduce( async (previousPromise, resolution) => {
        await previousPromise;
        await page.goto(site, {waitUntil: "networkidle2"});
        await page.setViewport({
            ...resolution,
            deviceScaleFactor: 1,
        });
        const path = `${getS3FolderPath(site, resolution)}`
        const imagePath = `${path}/image.jpg`;
        //@ts-ignore
        await processDOMElements(typographicElements, path, imagePath, resolution);
        return await page.screenshot({ path: `tmp/${imagePath}`, quality: 100});
      }, Promise.resolve());

    async function processDOMElements(selector:string, path:string, imagePath:string, resolution:Resolution) {
        const rawElements = await page.evaluate(selector => {
            const elements = document.querySelectorAll(selector);

            const parsed = Array.from(elements).map(element => {
                const rect = element.getBoundingClientRect()
                const styles = window.getComputedStyle(element);
                const text = element.textContent.trim();
                const tagName = element.tagName;
                const { fontWeight, fontSize, color, backgroundColor, display, visibility } = styles;
                const {x, y, width, height, top, bottom, right, left} = rect;
                return   {
                    text,
                    tagName,
                    rect: {x, y, width, height, top, bottom, right, left},
                    styles: {
                        color,
                        display,
                        visibility,
                        backgroundColor,
                        fontWeight: parseFloat(fontSize),
                        fontSize: parseFloat(fontWeight),
                        },

                };

            });
            return parsed;

        }, selector);

        const elements = rawElements.map((elem) => {
            return {
                ...elem,
                isInViewport: isInViewport(elem.rect, resolution),
                constrast: getContrast(elem.styles.color, elem.styles.backgroundColor),
            }
        })
        await writeJSON(path, {imagePath, resolution, elements});

    }
}

