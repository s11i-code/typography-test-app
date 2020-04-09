import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Snackbar from '@material-ui/core/Snackbar'
import Helmet from 'react-helmet'
import { navigate } from '@reach/router'
import { API } from 'aws-amplify'
import queryString from 'query-string'
import React, { useState, MouseEvent } from 'react'
import { EvaluateSiteRequestParams, Sitedata } from '../../symlinked-types'
import usePagesdata, { ReturnType as UsePagesdataType } from '../../hooks/usePagesdata'
import Page from '../../components/Page'
import SiteImageMap from '../../components/SiteImageMap'
import Spinner from '../../components/Spinner'
import { maxSelectableElements } from '../../config'
import { getViewportHeight, getViewportWidth } from '../../utils/window'

// TODO make this into a class component, this is getting messy

export default function EvaluatorPage() {
  const [sitesdata, loading, fetchError]: UsePagesdataType = usePagesdata()
  const [selectedElementIDs, setSelectedElementIDs] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const queryParams = queryString.parse((window.location as any).search)
  const siteIdx = Number(queryParams.site) ? Number(queryParams.site) : 0
  const sitedata: Sitedata = sitesdata[siteIdx]
  const isDemoSite = siteIdx === 0
  const noMorePages = sitesdata.length && siteIdx >= sitesdata.length

  if (noMorePages) {
    // we have gone through all the pages
    navigate('/thank-you')
  }
  function toggleSelectedElementIds(elemId: string): void {
    const alreadySelected = selectedElementIDs.includes(elemId)
    const newSelectedItems = alreadySelected ? selectedElementIDs.filter((id) => id !== elemId) : [...selectedElementIDs, elemId]
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
        .catch((err) => {
          console.error('Error saving data', err)
          setError("Can't save data. ")
        })
        .finally(() => setSaving(false))
    }
  }

  function showNextPage(event: MouseEvent): void {
    event.preventDefault()
    // clear previous selections:
    setSelectedElementIDs([])
    navigate(`/evaluator/?site=${siteIdx + 1}`)
  }

  return (
    <>
      {loading && <Spinner />}
      <Snackbar
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'top'
        }}
        open={!!(error || fetchError)}
        autoHideDuration={8000}
        onClose={() => setError(undefined)}
        ContentProps={{
          'aria-describedby': 'error-id'
        }}
        message={<span id="error-id">{error || fetchError}</span>}
      />
      {sitedata && (
        <>
          {/* disable scroll down on actual data collection sites */}
          {!isDemoSite && (
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
              <button type="button" className="button small" onClick={showNextPage}>
                Next site
              </button>
            </DialogActions>
          </Dialog>
          <Page>
            <SiteImageMap
              onClick={toggleSelectedElementIds}
              selectedElementIDs={selectedElementIDs}
              sitedata={sitedata}
              maxSelectableElements={maxSelectableElements}
            />
          </Page>
        </>
      )}
    </>
  )
}
