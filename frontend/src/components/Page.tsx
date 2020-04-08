import styled from '@emotion/styled'
import Amplify from 'aws-amplify'
import * as React from 'react'
import config from '../config'

const StyledPage = styled.div`
  display: block;
  flex: 1;
  position: relative;
`

Amplify.configure({
  API: {
    endpoints: [
      {
        endpoint: config.apiGateway.URL,
        name: 'backend',
        region: config.apiGateway.REGION
      }
    ]
  }
})

interface PageProps {
  className?: string
}

const Page: React.FC<PageProps> = ({ children, className }) => <StyledPage className={className}>{children}</StyledPage>

export default Page
