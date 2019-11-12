import contrast from "get-contrast";
import fs from "fs";
import shortid from "shortid";
import puppeteer, { Page } from "puppeteer";
import { sites, resolutions, getS3FolderPath } from '../backend/common';
import { Resolution, Element } from "../backend/common/types";

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
    const page: Page = await browser.newPage();
    await page.exposeFunction("log", console.log);

    // use reduce here to execute loop sequentially
    return resolutions.reduce( async (previousPromise: Promise<any>, resolution:Resolution) => {
        await previousPromise;
        await page.goto(site, {waitUntil: "networkidle2"});
        await page.setViewport({
            ...resolution,
            deviceScaleFactor: 1
        });
        const path = `${getS3FolderPath(site, resolution)}`
        const imagePath = `${path}/image.jpg`;
        await processSite(site, path, imagePath, resolution);
        return await page.screenshot({ path: `tmp/${imagePath}`, quality: 100});
      }, Promise.resolve());

    async function processSite(siteID:string, path: string, imagePath: string, resolution: Resolution): Promise<any> {
        const rawElements = await page.evaluate(()=> {
            const parsedElements = [];
            const IGNORE = ["style", "script", "noscript"];
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

            let node:any;
            while ((node = walker.nextNode()) !== null) {
                const parent = node.parentNode;
                const text = node.nodeValue.trim();
                const tagName = parent.tagName;
                if (IGNORE.includes(tagName)|| text.length === 0) {
                    continue;
                }

                const rect = parent.getBoundingClientRect();
                const styles = window.getComputedStyle(parent);
                const { fontWeight, fontSize, color, backgroundColor, display, visibility } = styles;
                const { width, height, top, bottom, right, left, x, y} = rect;
                parsedElements.push({
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
                });
            }
            return parsedElements;
        });

        const elements: Element[] = rawElements.map((elem) => {
            return {
                ...elem,
                id: shortid.generate(),
                contrast: getContrast(elem.styles.color, elem.styles.backgroundColor),
            }
        })
        await writeJSON(path, {siteID, imagePath, resolution, elements});
    }
}
