import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { globalHistory} from "@reach/router";
import { API } from "aws-amplify";
import { Link } from "gatsby";
import queryString from "query-string";
import React, {useEffect, useState} from "react";
import { resolutions, sites } from "../../../../backend/common";
import { EvaluateSiteRequestParams, GetSiteRequestParams, Sitedata } from "../../../../backend/common/types";
import Page from "../../components/Page";
import SiteImageMap from "../../components/SiteImageMap";
import Spinner from "../../components/Spinner";
import { maxSelectableElements } from "../../config";
import IndexLayout from "../../layouts";
import {getWindowWidth, isBuilding} from "../../utils/window";

// TODO make this into a class component, this is getting messy

export default function EvaluatorPage(props: {location: Location}) {

  const [sitesdata, setSitesdata] = useState<Sitedata[]>([]);
  const [selectedElementIDs, setSelectedElementIDs] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const windowWidth =  getWindowWidth();

  const queryParams = queryString.parse((props.location as any).search);

  const siteIdx = queryParams.site && !isNaN(queryParams.site as any) ? Number(queryParams.site) : 0;
  const sitedata: Sitedata = sitesdata[siteIdx];

  async function fetchData() {
    const resolutionIdx = selectEvaluatedResolutionIndex(windowWidth);
    const queryStringParameters: GetSiteRequestParams = {resolutionIdx};
    setLoading(true);

    const result = await API.get("backend", "/sites", { queryStringParameters });
    setLoading(false);

    setSitesdata(result.data);
  }

  function toggleSelectedElementIds(elemId: string): void {
    const alreadySelected = selectedElementIDs.includes(elemId);
    const newSelectedItems = alreadySelected ?
      selectedElementIDs.filter((id) => id !== elemId) : [...selectedElementIDs, elemId];
    setSelectedElementIDs(newSelectedItems);
    if (newSelectedItems.length === maxSelectableElements) {
      const data: EvaluateSiteRequestParams = {
        resolution: sitedata.resolution,
        selectedElementIDs,
        siteID: sitedata.siteID,
      };
      setLoading(true);
      API.post("backend", "/site/evaluate", {body: data}).then(() => setLoading(false));
    }
  }

  useEffect(() => {
    if (isBuilding()) { return;  }
    // only happens when component is mounted
    fetchData();
  }, []);

  useEffect(() => {
    // site changed, so reset selected elements
    globalHistory.listen(({ action }) => {
      if (action === "PUSH") {
        setSelectedElementIDs([]);
      }
    });
  }, []);

  const pageIsLast = siteIdx >= sites.length - 1;

  return (
    <IndexLayout>
      { loading && <Spinner  />}
      { sitedata &&
        (<>
          <Dialog open={selectedElementIDs.length === maxSelectableElements}>
            <DialogContent>
              <p>Thanks, your reply has been saved.  </p>
            </DialogContent>
            <DialogActions>
            {pageIsLast ?
              <Link className="button small" to="/thank-you" >Next</Link> :
              <Link className="button small" to={`/evaluator/?site=${siteIdx + 1}`}> Next site</Link>
            }
            </DialogActions>
          </Dialog>
          <Page>
            { Object.keys(sitedata).length > 1 && (
              <SiteImageMap
                onClick={toggleSelectedElementIds}
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
