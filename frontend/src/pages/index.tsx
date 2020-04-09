import * as React from 'react'

import { Link } from '@reach/router'
import Container from '../components/Container'
import Page from '../components/Page'
import { maxSelectableElements } from '../config'

const IndexPage = () => (
  <Page>
    <Container>
      <main>
        <section>
          <h1>Data science project needs data</h1>

          <section>
            <h2>What is this for?</h2>

            <p>
              I built this site to collect data for a University of Helsinki{' '}
              <a href="https://courses.helsinki.fi/fi/csm14210">seminar research project</a>, where I try to build a model for the order in
              which we observe text based on its characteristics, such as size, thickness, color, position etc.
            </p>
          </section>

          <section>
            <h2>Can I help?</h2>
            <p>
              Yes, you can and it would make my day! You will be shown several images of real websites and you just click (or tap if you're
              on mobile) on <b>text elements in the same order as you read them</b>. You can select {maxSelectableElements}.
            </p>
            <p>
              Just read the page as you normally would (no extra attention needed) and click on the texts as you read them. The first shown
              site will be a demo site.
            </p>
            <p>-Satu</p>
          </section>
          <div className="button-container">
            <Link className="button" to="/evaluator/">
              Start
            </Link>
          </div>
        </section>
      </main>
    </Container>
  </Page>
)
export default IndexPage
