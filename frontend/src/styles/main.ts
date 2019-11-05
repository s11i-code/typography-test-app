import { colors, fonts } from "./variables";

export default `
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .button {
    border-radius: 0;
    background: ${colors.electricViolet};
    box-shadow: none;
    color: #fff;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;

  }

  .MuiDialogContent-root {
    margin: 4% 3%;
  }

  .MuiDialogActions-root {
    background-color: lavender;
  }

  .button.small {
    padding: 0.25rem 0.5rem;
  }

  .tooltip {
    pointer-events: none;
    z-index: 1000;
    rect {
      rx: 6;
      width: 20px;
      height: 20px;
      fill: rgba(0,0,0,0.6);
    }

    text {
      fill: white;
      dominant-baseline: text-before-edge;;
    }
  }
`;
