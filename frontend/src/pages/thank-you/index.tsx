import * as React from "react";

import Container from "../../components/Container";
import Page from "../../components/Page";
import IndexLayout from "../../layouts";

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <main>
          <section>
          <h1>That was all!</h1>
          <p>Thank you so much. You're the best!
            <br/>
            <br/>
            -Satu
          </p>
          </section>
        </ main>
      </Container>
    </Page>
  </IndexLayout>
);

export default IndexPage;
