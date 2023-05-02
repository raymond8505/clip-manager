import { Global } from "@emotion/react";
import { CSS_RESET } from "./reset";

export const GlobalStyles = () => {
  return (
    <Global
      styles={`
        ${CSS_RESET}

        /* width */
  *::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }

  /* Track */
  *::-webkit-scrollbar-track {
    background: rgb(255 255 255 / 0.65);
  }

  /* Handle */
  *::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }

  /* Handle on hover */
  *::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
    `}
    />
  );
};
