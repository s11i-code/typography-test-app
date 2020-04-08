import * as React from 'react'

import Container from '../../components/Container'
import Page from '../../components/Page'
import { maxSelectableElements } from '../../config'
import IndexLayout from '../../layouts'

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <main>
          <section>
            <h1 style={{ marginBottom: '1rem' }}>Demo site</h1>

            <p>
              The idea of this demo site is to show you how you can select text items on the page ({maxSelectableElements} in total). This
              demo site data will not be used.
            </p>
            <section>
              <h2>How to proceed to the next page?</h2>
              <p>
                Once you have selected {maxSelectableElements} text items on this page by clicking, you will be able to continue to the real
                data collection.
              </p>

              <p>
                During the real data collection, you will be shown real websites like Wikipedia and the idea is to select the text items in
                the <b>same order as you read them</b>. First thing you read first, second thing second, etc.
              </p>
            </section>

            <section>
              <h2>What is selectable?</h2>
              <p>
                You can select text items such as titles (like "Demo site" above) and paragraphs (like this one) and buttons (like the one
                below) by clicking on them. Images can't be selected. After you select an item, you will see it highlighted with number
                indicating its order.
              </p>
              <p style={{ paddingBottom: '0.5rem' }}>
                <button type="button" className="small button">
                  This button is selectable
                </button>
              </p>
            </section>

            <section>
              <h2>What is not selectable?</h2>
              <p>
                Not all text items can be selected (mainly images with text like the one below). If the item is not clickable, you can just
                <b>skip over</b> to the next one you read.
              </p>
              <p style={{ textAlign: 'center' }}>
                {' '}
                <img width="200px" src="/demo-img.png" alt="demo" />
              </p>
            </section>
          </section>
        </main>
      </Container>
    </Page>
  </IndexLayout>
)

export default IndexPage
