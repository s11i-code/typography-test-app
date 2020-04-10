import * as React from 'react'
import { Link } from '@reach/router'
import Container from '../components/Container'
import Page from '../components/Page'

const NotFoundPage = () => (
  <Page>
    <Container>
      <h1>404: Page not found.</h1>
      <p style={{ textAlign: 'center' }}>
        <Link className="button small" to="/">
          Back to home page
        </Link>
      </p>
    </Container>
  </Page>
)

export default NotFoundPage
