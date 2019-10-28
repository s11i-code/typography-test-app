import styled from "@emotion/styled";
import * as React from "react";

import { getEmSize } from "../styles/mixins";
import { widths } from "../styles/variables";

const StyledContainer = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: 700px;
  padding: 1em;
`;

interface ContainerProps {
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) =>
  <StyledContainer
    className={className}>
      {children}
  </StyledContainer>;

export default Container;
