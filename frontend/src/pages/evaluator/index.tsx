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
import Spinner from "../../components/Spinner";

import SiteImageMap from "../../components/SiteImageMap";
import { maxSelectableElements } from "../../config";
import IndexLayout from "../../layouts";
import {getWindowWidth, isBuilding} from "../../utils/window";
// TODO make this into a class component, this is getting messy
export default function EvaluatorPage() {

  const [sitesdata, setSitesdata] = useState<Sitedata[]>([]);
  const [selectedElementIDs, setSelectedElementIDs] = useState<string[]>([]);
  const [siteIdx, setSiteIdx] = useState(0);

  const [loading, setLoading] = useState(false);
  const windowWidth =  getWindowWidth();
  const sitedata: Sitedata = sitesdata[siteIdx];

  async function fetchData() {
    const resolutionIdx = selectEvaluatedResolutionIndex(windowWidth);
    const queryStringParameters: GetSiteRequestParams = {resolutionIdx};
    setLoading(true);

    const result = await API.get("backend", "/sites", { queryStringParameters });
    setLoading(false);

    setSitesdata(result.data);
  }

  function setSelectedElementIds(elemId: string): void {
    const alreadySelected = selectedElementIDs.includes(elemId);
    const maxSelected = selectedElementIDs.length > maxSelectableElements;
    const newSelectedItems = [...selectedElementIDs, elemId];

    if (alreadySelected) { return; }
    setSelectedElementIDs(newSelectedItems);

    if (!maxSelected) { return; }

    const data: EvaluateSiteRequestParams = {
      resolution: sitedata.resolution,
      selectedElementIDs: newSelectedItems,
      siteID: sitedata.siteID,
    };
    setLoading(true);
    API.post("backend", "/site/evaluate", {body: data}).then(() => setLoading(false));
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

  return (
    <IndexLayout>
      { loading && <Spinner  />}
      { sitedata &&
        (<>
          <Dialog open={selectedElementIDs.length >= maxSelectableElements}>
            <DialogContent>
              <p>Thanks, your reply has been saved. </p>
            </DialogContent>
            <DialogActions>
              <button onClick={handleNextButtonClick} className="button small">Give me more</button>
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
        </>)
        }
    </IndexLayout>
  );
}

function selectEvaluatedResolutionIndex(windowWidth: number): number {
  // select the closest resolution which is bigger than window width
  const diffs = resolutions.map(({width}) => width - windowWidth);
  return diffs.reduce((bestIdx, diff, currIdx) => {
    return diff >= 0  && diff < Math.abs(diffs[bestIdx]) ? currIdx : bestIdx;
  }, diffs.length - 1 );
}
