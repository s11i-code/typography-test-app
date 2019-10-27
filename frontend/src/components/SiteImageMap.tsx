// @ts-ignore
import ImageMapper from "react-image-mapper";
// @ts-ignore
import {resolutions } from "../../../../backend/common";
import { Sitedata } from "../../../backend/common/types";

function computeCoords(rect: any) {
  // define top left corner and bottom right corner:
  return [ rect.left, rect.top, rect.left + rect.width, rect.top + rect.height];
}

// TODO: add type definition
function isVisible(element: any): boolean {
  return element.isInViewport
    && element.styles.display !== "none"
    && element.styles.visibility !== "hidden"
    && element.text !== ""
    && (element.rect.width !== 0 && element.rect.height !== 0);
}
const BUCKET_URL = "https://typography-test-app-scraped-data.s3.eu-central-1.amazonaws.com/";

interface Props {
  sitedata: Sitedata;
}
export default function SiteImageMap(props: Props) {

  const { imagePath, elements } = props.sitedata;

  const imageMap = elements ? {
    areas: elements
      .filter((elem: any) => isVisible(elem))
      .map((elem: any, index: number) => ({
        coords: computeCoords(elem.rect),
        name: `element-${index}`,
        shape: "rect",
        text: elem.text,
    })),
    name: "image-map",
  } : {};

  return (
    imagePath ?
            <ImageMapper
              src={`${BUCKET_URL}${imagePath}`}
              map={imageMap} width={props.sitedata.resolution.width}
            /> : null
  );
}

// https://typography-test-app-scraped-data.s3.eu-central-1.amazonaws.com//github.comsatueveliina/960x800/image.jpg
