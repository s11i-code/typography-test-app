import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Snackbar from '@material-ui/core/Snackbar'
import Helmet from 'react-helmet'

import { globalHistory } from '@reach/router'
import { API } from 'aws-amplify'
import { Link } from 'gatsby'
import queryString from 'query-string'
import React, { useEffect, useState, useCallback } from 'react'
import { isDemoSite, resolutions, sites } from '../../../../backend/common'
import { EvaluateSiteRequestParams, GetSiteRequestParams, Sitedata } from '../../../../backend/common/types'
import Page from '../../components/Page'
import SiteImageMap from '../../components/SiteImageMap'
import Spinner from '../../components/Spinner'
import { maxSelectableElements } from '../../config'
import IndexLayout from '../../layouts'
import { buildIsOngoing, getViewportHeight, getViewportWidth } from '../../utils/window'

// TODO make this into a class component, this is getting messy

export default function EvaluatorPage(props: { location: Location }) {
  const [sitesdata, setSitesdata] = useState<Sitedata[]>([])
  const [selectedElementIDs, setSelectedElementIDs] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const windowWidth = getViewportWidth()

  const queryParams = queryString.parse((props.location as any).search)

  const siteIdx = Number(queryParams.site) ? Number(queryParams.site) : 0
  const sitedata: Sitedata = sitesdata[siteIdx]

  if (sitedata && selectedElementIDs.length === 0) {
    console.log('------------New site', sitedata.siteID)
    console.log(
      'Element texts',
      sitedata.elements.map(({ text }) => text)
    )
    console.log('Elements ', sitedata.elements)
  }

  const fetchData = useCallback(async () => {
    const resolutionIdx = selectEvaluatedResolutionIndex(windowWidth)
    const queryStringParameters: GetSiteRequestParams = { resolutionIdx }
    setLoading(true)

    API.get('backend', '/sites', { queryStringParameters })
      .then(result => {
        setSitesdata(result.data)
      })
      .catch(err => {
        console.error('Error fetching data', err)
        setError("Can't fetch data.")
      })
      .finally(() => setLoading(false))
  }, [windowWidth])

  function toggleSelectedElementIds(elemId: string): void {
    const alreadySelected = selectedElementIDs.includes(elemId)
    if (!alreadySelected) {
      console.log(
        'Clicked element',
        sitedata.elements.filter(({ id }) => id === elemId)
      )
    }
    const newSelectedItems = alreadySelected ? selectedElementIDs.filter(id => id !== elemId) : [...selectedElementIDs, elemId]
    setSelectedElementIDs(newSelectedItems)
    if (newSelectedItems.length === maxSelectableElements) {
      const data: EvaluateSiteRequestParams = {
        resolution: sitedata.resolution,
        selectedElementIDs: newSelectedItems,
        siteID: sitedata.siteID,
        viewport: {
          height: getViewportHeight(),
          width: getViewportWidth()
        }
      }
      setSaving(true)
      API.post('backend', '/site/evaluate', { body: data })
        .catch(err => {
          console.error('Error saving data', err)
          setError("Can't save data. ")
        })
        .finally(() => setSaving(false))
    }
  }

  useEffect(() => {
    if (buildIsOngoing()) {
      return
    }
    // data fetch only happens when component is mounted (once per replier unless they reload)
    fetchData()
  }, [fetchData])

  useEffect(() => {
    // site changed, so reset selected elements
    globalHistory.listen(({ action }) => {
      if (action === 'PUSH') {
        setSelectedElementIDs([])
      }
    })
  }, [])

  const pageIsLast = siteIdx >= sites.length - 1

  return (
    <IndexLayout>
      {loading && <Spinner />}
      <Snackbar
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'top'
        }}
        open={error !== undefined}
        autoHideDuration={8000}
        onClose={() => setError(undefined)}
        ContentProps={{
          'aria-describedby': 'error-id'
        }}
        message={<span id="error-id">{error}</span>}
      />
      {sitedata && (
        <>
          {/* disable scroll down on actual data collection sites */}
          {!isDemoSite(sitedata.siteID) && (
            <Helmet
              bodyAttributes={{
                class: 'no-vertical-scroll'
              }}
            />
          )}
          <Dialog fullWidth maxWidth="xs" open={selectedElementIDs.length === maxSelectableElements}>
            <DialogContent>
              {saving && <Spinner />}
              {!saving && !error && <p>Thanks, your reply has been saved. </p>}
            </DialogContent>
            <DialogActions>
              {pageIsLast ? (
                <Link className="button small" to="/thank-you">
                  Next site
                </Link>
              ) : (
                <Link className="button small" to={`/evaluator/?site=${siteIdx + 1}`}>
                  Next site
                </Link>
              )}
            </DialogActions>
          </Dialog>
          <Page>
            {Object.keys(sitedata).length > 1 && (
              <SiteImageMap
                onClick={toggleSelectedElementIds}
                selectedElementIDs={selectedElementIDs}
                sitedata={sitedata}
                maxSelectableElements={maxSelectableElements}
                width={windowWidth}
              />
            )}
          </Page>
        </>
      )}
    </IndexLayout>
  )
}

function selectEvaluatedResolutionIndex(windowWidth: number): number {
  // select the closest resolution which is bigger than window width
  const diffs = resolutions.map(({ width }) => width - windowWidth)
  return diffs.reduce((bestIdx, diff, currIdx) => (diff >= 0 && diff < Math.abs(diffs[bestIdx]) ? currIdx : bestIdx), diffs.length - 1)
}
