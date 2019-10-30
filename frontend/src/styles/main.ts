import { colors } from "./variables";

export default `
  .button {
    border-radius: 0;
    background: ${colors.electricViolet};
    box-shadow: none;
    color: #fff;
    min-width: 40px;
    min-height: 40px;
    padding: 5px 15px;
    font-size: 1rem;
  }

  .tooltip {
    position: absolute;
    font-size: 80%;
    color: #fff;
    padding: 2px 4px;
    background: rgba(0,0,0,0.8);
    transform: translate3d(-50%, -50%, 0);
    border-radius: 5px;
    pointer-events: none;
    z-index: 1000;
  }
`;
