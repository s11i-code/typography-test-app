import React, { FunctionComponent } from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/core'
import Amplify from 'aws-amplify'
import main from './styles/main'
import normalize from './styles/normalize'
import config from './config'

import HomePage from './pages'
import EvaluatorPage from './pages/evaluator'
import DemoPage from './pages/demo'
import ThankYouPage from './pages/thank-you'
import Page404 from './pages/404'

const StyledLayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

type Props = { component: FunctionComponent } & RouteComponentProps

// eslint-disable-next-line react/jsx-props-no-spreading
const Route: FunctionComponent<Props> = ({ component: Component, ...rest }) => <Component {...rest} />

function App() {
  return (
    <div>
      <Global styles={() => css(normalize, main)} />
      <StyledLayoutRoot>
        <Router>
          <Route component={HomePage} path="/" />
          <Route component={EvaluatorPage} path="/evaluator" />
          <Route component={DemoPage} path="/demo" />
          <Route component={ThankYouPage} path="/thank-you" />
          <Route component={Page404} default path="/404" />
        </Router>
      </StyledLayoutRoot>
    </div>
  )
}

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

export default App
