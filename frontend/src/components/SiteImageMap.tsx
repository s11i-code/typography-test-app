import styled from "@emotion/styled";
import React, { useState } from "react";
// @ts-ignore
import { Element, Sitedata } from "../../../backend/common/types";

const BUCKET_URL = "https://typography-test-app-scraped-data.s3.eu-central-1.amazonaws.com/";

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const Img = styled.img`
  display: block;
  min-width: 100%;
  height: auto;
`;

// TODO: add type definition
function isVisible(element: any): boolean {
  return element.styles.display !== "none"
    && element.styles.visibility !== "hidden"
    && element.text !== ""
    && (element.rect.width !== 0 && element.rect.height !== 0);
}

interface Props {
  sitedata: Sitedata;
  onClick: (id: string) => void;
  selectedElementIDs: string[];
  maxSelectableElements?: number;
  width: number;
}

const TOOLTIP_SIZE_PX = 25;
export default function SiteImageMap(props: Props) {

  const { sitedata, selectedElementIDs,  width, onClick} = props;
  const { imagePath, elements, resolution } = sitedata;
  const [hoveredElement, setHoveredElement] = useState<string|undefined>(undefined);

  const visibleElements = elements.filter((elem: Element) => isVisible(elem));
  console.log("Number of visible elements", visibleElements.length);
  console.log("Visible elements ", visibleElements.map(({text}) => text));

  const handleHoverElement = (elemId: string) => {
    console.log("Hovered element", sitedata.elements.filter(({id}) => id === elemId));
    setHoveredElement(elemId);
  };
  return (
    <div>
      {imagePath &&
        (<>
          <Img src={ `${BUCKET_URL}${imagePath}`}/>
          <Svg width={width} viewBox={`0 0 ${resolution.width} ${resolution.height}`}>

            {visibleElements
              .map(({rect, id}) => {
                const bordered = hoveredElement === id || selectedElementIDs.includes(id);
                return (<rect
                  key={id}
                  fillOpacity={selectedElementIDs.includes(id) ? "0.3"   : "0"}
                  y={rect.top}
                  x={rect.left}
                  onClick={() => onClick(id)}
                  height={rect.height}
                  width={rect.width}
                  style={{cursor: "pointer"}}
                  stroke={bordered ? "grey" : undefined}
                  onMouseEnter={ () => handleHoverElement(id)}
                  onMouseLeave={() => setHoveredElement(undefined)}
            />);
          })}

        {selectedElementIDs
              .map((id, idx) => {
                const elem = visibleElements.find((el) => el.id  === id) as Element;
                const { rect } = elem;
                const x = rect.left + rect.width - TOOLTIP_SIZE_PX;
                const y = rect.top + (rect.height - TOOLTIP_SIZE_PX) / 2;
                return (
                  <g
                    key={`tooltip-${elem.id}`}
                    className="tooltip"
                  >
                    <rect
                      width={TOOLTIP_SIZE_PX}
                      height={TOOLTIP_SIZE_PX}
                      x={x}
                      y={y}
                    />
                    <text y={y + 3} x={x + 8} >{idx + 1}</text>
                  </g>);
              })
            }
          </Svg>
        </>)
        }
    </div>
 );
}
