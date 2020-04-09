import styled from '@emotion/styled'
import * as React from 'react'

const StyledPage = styled.div`
  display: block;
  flex: 1;
  position: relative;
`

interface PageProps {
  className?: string
}

const Page: React.FC<PageProps> = ({ children, className }) => <StyledPage className={className}>{children}</StyledPage>

export default Page
