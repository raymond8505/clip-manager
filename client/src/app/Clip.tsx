import styled from "@emotion/styled";
import { IClip } from "../store";

interface Props {
  clip: IClip;
}

const Image = styled.img`
  width: 100%;
`;

const Wrapper = styled.li`
  width: 200px;
  padding: 6px 4px 0px;
`;
export function Clip({ clip }: Props) {
  return (
    <Wrapper>
      <Image src={clip.paths.image} />
    </Wrapper>
  );
}
