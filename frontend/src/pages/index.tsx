import { Link } from "gatsby";
import * as React from "react";

import Container from "../components/Container";
import Page from "../components/Page";
import IndexLayout from "../layouts";

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <main>
          <h1>Welcome to the website typography evaluator!</h1>

          <p>I built this site to collect data for research project
            for a seminar in the University of Helsinki. </p>

          <p>In this project I aim to study <b>the order </b>
          in which the human brain perceives different parts of a website.</p>

          <p>After you click on the Start button below, you will be shown pictures of
            various websites. You can select a <b>maximum of five elements</b>
            on the site by clicking on them. The order in which you click will
            be interpreted as the order in which you perceive the item, so should
            <b>click first you read first, second thing you read second </b> etc.
          </p>

          <p><b>NOTE</b>: The system is not perfect, and it may not recognize all
          elements as text (mainly images).
          If the thing you you perceive is not clickable,
          you can ignore it and move on to the next one. <br/>
          </p>

          <p>
            <b> Thanks, your help is very valuable and much appreciated!</b>
            <br/> <br/>
            -Satu
          </p>

          <Link className="button" to="/evaluator/">Start</Link>
        </main>
      </Container>
    </Page>
  </IndexLayout>
);

export default IndexPage;
