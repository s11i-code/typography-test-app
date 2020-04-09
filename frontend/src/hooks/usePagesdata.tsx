import { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import { GetSiteRequestParams, Sitedata } from '../symlinked-types'

import { getViewportWidth } from '../utils/window'

export type ReturnType = [Sitedata[], boolean, string | undefined]

export default function usePagesdata(): ReturnType {
  const [sitesdata, setSitesdata] = useState<Sitedata[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const windowWidth = getViewportWidth()
  useEffect(() => {
    const queryStringParameters: GetSiteRequestParams = { windowWidth }

    setLoading(true)
    API.get('backend', '/sites', { queryStringParameters })
      .then((result) => {
        setSitesdata(result.data)
        console.log('-------------SITES-------------')
        console.log(result.data)
      })
      .catch((err) => {
        console.error('Error fetching data', err)
        setError("Can't fetch data.")
      })
      .finally(() => setLoading(false))
  }, [])
  return [sitesdata, loading, error]
}
