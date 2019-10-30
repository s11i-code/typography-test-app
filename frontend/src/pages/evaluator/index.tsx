import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { API } from "aws-amplify";
import React, {useEffect, useState} from "react";
// @ts-ignore
import ImageMapper from "react-image-mapper";
import { resolutions } from "../../../../backend/common";
import { Element, EvaluateSiteRequestParams, GetSiteRequestParams, Sitedata } from "../../../../backend/common/types";
import Page from "../../components/Page";
import SiteImageMap from "../../components/SiteImageMap";
import { maxSelectableElements } from "../../config";
import IndexLayout from "../../layouts";

// TODO make this into a class component, this is getting messy
export default function EvaluatorPage() {

  const [sitedata, setSitedata] = useState<Sitedata>({});
  const [selectedElementIDs, setSelectedElementIDs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const windowWidth =  getWindowWidth();

  useEffect(() => {
    const fetchData = async () => {
      const resolutionIdx = selectEvaluatedResolution(windowWidth);
      const params: GetSiteRequestParams = {resolutionIdx};
      const result = await API.get("backend", "/sites", {
        queryStringParameters: params,
      });
      const data = result.data[0];
      setSitedata(data);
    };
    fetchData();
  }, []);

  function setSelectedElementIds(elem: Element): void {
    if (selectedElementIDs.includes(elem.id)) {
      return;
    }
    const newSelectedItems = [...selectedElementIDs, elem.id];
    setSelectedElementIDs(newSelectedItems);

    if (selectedElementIDs.length < maxSelectableElements - 1) {
      return;
    }
    setSaving(true);
    const data: EvaluateSiteRequestParams = {
      resolution: sitedata.resolution,
      selectedElementIDs: newSelectedItems,
      siteID: sitedata.siteID,
    };
    API.post("backend", "/site/evaluate", {body: data}).then(() => setSaving(false));
  }

  return (
    <IndexLayout>
        <Dialog open={selectedElementIDs.length >= maxSelectableElements}>
          <DialogContent>
          <p>Thank you for the reply! It has been saved. </p>
          </DialogContent>
          <DialogActions>
            <button onClick={() => {throw new Error("unimplemented"); }} className="button">Next</button>
          </DialogActions>
        </Dialog>
      <Page>
        { Object.keys(sitedata).length > 1 && (
          <SiteImageMap
            onClick={setSelectedElementIds}
            selectedElementIDs={selectedElementIDs}
            sitedata={sitedata}
            maxSelectableElements={maxSelectableElements}
            width={ windowWidth }
          />)}
      </Page>
    </IndexLayout>
  );
}

// tslint:disable-next-line: max-line-length
const getWindowWidth = (): number => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

function selectEvaluatedResolution(windowWidth: number): number {
  // select the closest resolution which is bigger than window width
  const diffs = resolutions.map(({width}) => width - windowWidth);
  return diffs.reduce((bestIdx, curr, currIdx) => {
     return diffs[currIdx] >= 0  && diffs[currIdx] < diffs[bestIdx] ? currIdx : bestIdx;
  }, 0);
}
