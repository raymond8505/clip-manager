import styled from "@emotion/styled";
import { Panel as RRPanel } from "react-resizable-panels";

export const MainWrapper = styled.div`
  background-color: #2a2a2a;
  color: #eee;
  width: 100vw;
  height: 100vh;
  padding: 1vw;
`;

export const Panel = styled(RRPanel)`
  background: #222;
  padding: 4px;
  border-radius: 4px;
  overflow: auto !important;

  h2 {
    opacity: 0.7;
    font-size: 1.2em;
    margin-bottom: 4px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgb(255 255 255 / 0.3);
  }
`;

export const UnstyledButton = styled.button`
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  font-size: 1em;
  font-weight: inherit;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

export const ListItemButton = styled(UnstyledButton)`
  width: 100%;
  display: block;
  text-align: left;
  color: inherit;
  transition: all 0.15s ease-in-out;
  padding: 2px 8px;

  &:hover,
  &:focus-visible {
    background: rgb(0 0 0 / 0.2);
  }
`;
