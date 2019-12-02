import { colors } from "./variables";

export default `
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .button {
    border-radius: 0;
    background: ${colors.buttonColor};
    border-color: ${colors.buttonColor};
    box-shadow: none;
    color: #fff;
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
    border-style: solid;
  }

  .MuiDialogContent-root {
    margin: 4% 3%;
  }

  .MuiDialogActions-root {
    padding: 0 !important;
    padding-bottom: 1.5rem !important;
    justify-content: center !important;

  }

  .button.small {
    padding: 0.3rem 0.7rem;
  }

  .tooltip {
    pointer-events: none;
    z-index: 1000;
    rect {
      rx: 6;
      fill: rgba(0,0,0,0.8);
    }

    text {
      fill: white;
      dominant-baseline: text-before-edge;;
    }
  }
`;
