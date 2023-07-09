import { Button, Input, Space } from "antd";
import { IClip } from "../store";
import { trimExtension } from "./helpers";
import { EditOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { UnstyledButton } from "./App.styles";

interface Props {
  clip: IClip;
}
const Wrapper = styled.div`
  font-size: 1.1em;
`;
const EditButton = styled(UnstyledButton)`
  margin-right: 1em;
  svg {
    height: 1em;
    width: 1em;
    color: green;
  }
`;
export const ClipName = ({ clip }: Props) => {
  return (
    <Wrapper>
      <EditButton>
        <EditOutlined />
      </EditButton>
      <span>{trimExtension(clip.name)}</span>
    </Wrapper>
  );
};
