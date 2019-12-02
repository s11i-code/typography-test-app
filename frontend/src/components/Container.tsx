import styled from "@emotion/styled";
import * as React from "react";

const InnerContainer = styled.div`
  background-color: white;
  position: relative;
  width: auto;
  max-width: 700px;
  padding: 2rem;
  margin: 0 auto;
`;

const OuterContainer = styled.div`
  margin: 2% 2% ;
`;

interface ContainerProps {
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) =>
  <OuterContainer>
    <InnerContainer
    className={className}>
      {children}
    </InnerContainer>
  </OuterContainer>;

export default Container;
