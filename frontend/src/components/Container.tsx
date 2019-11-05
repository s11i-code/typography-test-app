import styled from "@emotion/styled";
import * as React from "react";

const StyledContainer = styled.div`
  background-color: white;
  position: relative;
  width: auto;
  max-width: 700px;
  padding: 6% 8% 10% 8%;
  margin: 2% auto;
`;

const OuterContainer = styled.div`
  margin: 0 2% ;
`;

interface ContainerProps {
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) =>
  <OuterContainer>
    <StyledContainer
    className={className}>
      {children}
    </StyledContainer>
  </OuterContainer>;

export default Container;
