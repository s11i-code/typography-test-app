import { API } from "aws-amplify";
import React, {useEffect, useState} from "react";
// @ts-ignore
import ImageMapper from "react-image-mapper";
// @ts-ignore
import {resolutions } from "../../../../backend/common";
import { Sitedata } from "../../../../backend/common/types";
import Page from "../../components/Page";
import SiteImageMap from "../../components/SiteImageMap";

import IndexLayout from "../../layouts";

export default function EvaluatorPage() {

  const [sitedata, setSitedata] = useState<Sitedata|{}>({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await API.get("sites", "/sites", {});
      const data = result.data[0];
      setSitedata(data);
    };
    fetchData();
  }, []);

  return (
    <IndexLayout>
      <Page>
        { Object.keys(sitedata).length > 1 && <SiteImageMap sitedata={sitedata}/>}
      </Page>
    </IndexLayout>
  );
}
