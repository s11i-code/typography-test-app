import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { navigate } from "@reach/router";
import { API } from "aws-amplify";
import React, {useEffect, useState} from "react";
// @ts-ignore
import ImageMapper from "react-image-mapper";
import { resolutions, sites } from "../../../../backend/common";
import { Element, EvaluateSiteRequestParams, GetSiteRequestParams, Sitedata } from "../../../../backend/common/types";
import Page from "../../components/Page";
import SiteImageMap from "../../components/SiteImageMap";
import { maxSelectableElements } from "../../config";
import IndexLayout from "../../layouts";
import {getWindowWidth, isBuilding} from "../../utils/window";
// TODO make this into a class component, this is getting messy
export default function EvaluatorPage() {

  const [sitesdata, setSitesdata] = useState<Sitedata[]>([]);
  const [selectedElementIDs, setSelectedElementIDs] = useState<string[]>([]);
  const [siteIdx, setSiteIdx] = useState(0);

  const [saving, setSaving] = useState(false);
  const windowWidth =  getWindowWidth();
  const sitedata: Sitedata = sitesdata[siteIdx];

  async function fetchData() {
    const resolutionIdx = selectEvaluatedResolution(windowWidth);
    const params: GetSiteRequestParams = {resolutionIdx};
    const result = await API.get("backend", "/sites", {
      queryStringParameters: params,
    });
    setSitesdata(result.data);
  }

  function setSelectedElementIds(elem: Element): void {
    const alreadySelected = selectedElementIDs.includes(elem.id);
    const maxSelected = selectedElementIDs.length > maxSelectableElements;
    const newSelectedItems = [...selectedElementIDs, elem.id];

    if (alreadySelected) { return; }
    setSelectedElementIDs(newSelectedItems);

    if (!maxSelected) { return; }

    const data: EvaluateSiteRequestParams = {
      resolution: sitedata.resolution,
      selectedElementIDs: newSelectedItems,
      siteID: sitedata.siteID,
    };
    setSaving(true);
    API.post("backend", "/site/evaluate", {body: data}).then(() => setSaving(false));
  }

  useEffect(() => {
    if (isBuilding()) { return;  }

    fetchData();
  }, []);

  function handleNextButtonClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();

    if (siteIdx + 1 < sites.length) {
      setSiteIdx(siteIdx + 1);
      setSelectedElementIDs([]);
    } else {
      navigate("/thank-you");
    }
  }

  if (!sitedata) {
    return null;
  }
  return (
    <IndexLayout>
        <Dialog open={selectedElementIDs.length >= maxSelectableElements}>
          <DialogContent>
          <p>Thank you for the reply! It has been saved. </p>
          </DialogContent>
          <DialogActions>
             <button onClick={handleNextButtonClick} className="button">Next page</button>
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

function selectEvaluatedResolution(windowWidth: number): number {
  // select the closest resolution which is bigger than window width
  const diffs = resolutions.map(({width}) => width - windowWidth);
  return diffs.reduce((bestIdx, curr, currIdx) => {
     return diffs[currIdx] >= 0  && diffs[currIdx] < diffs[bestIdx] ? currIdx : bestIdx;
  }, 0);
}
