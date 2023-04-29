import { Global } from "@emotion/react";
import { CSS_RESET } from "./reset";

export const GlobalStyles = () => {
  return (
    <Global
      styles={`
        ${CSS_RESET}
    `}
    />
  );
};
