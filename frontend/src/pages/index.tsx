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
            <section><h2>How can I help?</h2>
            <p>That's easy! You will be shown a bunch of images of real websites
              and you just click (or tap) on text elements in the order as you read them.
             You can select {maxSelectableElements} elements. The first one will be a demo site.
            </p>

            <p>NOTE: The system is not perfect, and it may not recognize all
            elements as text (mainly images).
            If the thing you you perceive is not clickable,
            you can ignore it and move on to the next one. <br/>
            </p>
            </section>
            <section><h2>What is it for?</h2>

            <p>I built this site to collect data for research project
              for a <a href="https://courses.helsinki.fi/fi/csm14210"> course in the University of Helsinki</a>. In my
              project, I try to build a model for the order in which we observe text based on its
               characteristic, such as size, thickness, color, position etc.</p>
            <p>
               Thank you in advance! Your help is much appreciated.
              <br/> <br/>
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
