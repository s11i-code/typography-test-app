import styled from "@emotion/styled";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 1;
  align-items: center;
`;

const Container  = () =>
  <StyledContainer>
      <CircularProgress/>
  </StyledContainer>;

export default Container;
