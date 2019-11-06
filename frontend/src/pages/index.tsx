import { Link } from "gatsby";
import * as React from "react";

import Container from "../components/Container";
import Page from "../components/Page";
import { maxSelectableElements } from "../config";
import IndexLayout from "../layouts";

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <main>
          <section>
            <h1>Data science project needs data</h1>
            <section><h2>Can I help?</h2>
            <p>Yes, it's easy! You will be shown a bunch of images of real websites
              and you just click (or tap) on text elements in the order as you read them.
             You can select {maxSelectableElements} elements. The first one will be a demo site.
            </p>

            </section>
            <section><h2>What is this for?</h2>

            <p>I built this site to collect data for a University of Helsinki  <a href="https://courses.helsinki.fi/fi/csm14210">seminar research project
             </a>. In it, I try to build a model for the order in which we observe text based on its
               characteristics, such as size, thickness, color, position etc.</p>
            <p>
               Thank you in advance! Your help is much appreciated.
              <br/>
               -Satu
            </p>
            </section>
            <div className="button-container">
              <Link className="button" to="/evaluator/">Start evaluating</Link>
            </div>
          </section>
        </main>
      </Container>
    </Page>
  </IndexLayout>
);

export default IndexPage;
