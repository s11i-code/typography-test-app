import * as React from "react";

import Container from "../../components/Container";
import Page from "../../components/Page";
import { maxSelectableElements } from "../../config";
import IndexLayout from "../../layouts";

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <main>
          <section>
              <h1 style={{marginBottom: "1rem"}}>Demo site</h1>

              <p>This is a demo site to show you the idea. </p>
              <p>
                Click on the texts in the same order as you read them.
              </p>

              <p>
                Once you have clicked on { maxSelectableElements} things, you will be able to continue.
                 Buttons can be clicked on too: <br/>
              </p>

              <p style={{textAlign: "center"}}>
                <button style={{marginTop: "1rem"}} className="small button">You can press this</button>
              </p>

              <p>
                NOTE: not all text can be selected, even if they contain text (mainly images).
                If the item is not clickable, you can just skip over to the next one you read.
              </p>
              <p style={{textAlign: "center"}}> <img width="200px" src={"/demo-img.png"} alt="demo" /></p>
            </section>
        </main>
      </Container>
    </Page>
  </IndexLayout>
);

export default IndexPage;
