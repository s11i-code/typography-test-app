import React, { useState } from "react";
// @ts-ignore
import ImageMapper from "react-image-mapper";

// @ts-ignore
import {resolutions } from "../../../../backend/common";
import { Element, Sitedata } from "../../../backend/common/types";

function computeCoords(rect: any) {
  // define top left corner and bottom right corner:
  return [ rect.left, rect.top, rect.left + rect.width, rect.top + rect.height];
}
// tslint:disable-next-line: max-line-length
const getWindowWidth = (): number => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

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
  onClick: (elem: Element) => void;
  selectedElementIDs: string[];
  maxSelectableElements?: number;
}

export default function SiteImageMap(props: Props) {

  const { sitedata, selectedElementIDs, maxSelectableElements = 5 } = props;
  const { imagePath, elements } = sitedata;
  const [hoveredArea, setHoveredArea] = useState<Element|undefined>(undefined);

  const imageMap = elements ? {
    areas: elements
      .filter((elem: Element) => isVisible(elem))
      .map((elem: Element, index: number) => ({
        coords: computeCoords(elem.rect),
        id: elem.id,
        name: `element-${index}`,
        shape: "rect",
        text: elem.text,
    })),
    name: "image-map",
  } : {};

  function getTipPosition(area: any) {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
  }
  function getTipText(area: Element): string {
    if (selectedElementIDs.includes(area.id)) {
      return "selected";
    } else if (maxSelectableElements <= selectedElementIDs.length) {
      return "maximum number reached";
    }
    return `${selectedElementIDs.length + 1}`;
  }

  return (
    <div>
      {imagePath ?
            <ImageMapper
              src={`${BUCKET_URL}${imagePath}`}
              map={imageMap}
              imgWidth={props.sitedata.resolution.width}
              width={getWindowWidth()}
              onClick= {props.onClick}
              onMouseEnter={(area: Element) => setHoveredArea(area)}
              onMouseLeave={() => setHoveredArea(undefined)}
            /> : null}
        {hoveredArea &&
          <span className="tooltip"
            style={getTipPosition(hoveredArea) }>
              {getTipText(hoveredArea)}
          </span>}
    </div>
  );
}
