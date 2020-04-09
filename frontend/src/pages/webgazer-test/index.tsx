import React, { useEffect } from 'react'
import Container from '../../components/Container'

declare let webgazer: any

const WebGazerTestPage = () => {
  useEffect(() => {
    webgazer
      .setGazeListener((data: any, elapsedTime: any) => {
        if (data == null) {
          return
        }
        // const xprediction = data.x // these x coordinates are relative to the viewport
        // const yprediction = data.y // these y coordinates are relative to the viewport
        console.log(elapsedTime) // elapsed time is based on time since begin was called
      })
      .begin()
  })

  return (
    <Container>
      <h1>Hello</h1>
    </Container>
  )
}

export default WebGazerTestPage
