import styled from "@emotion/styled";
import {
  PanelResizeHandle,
  PanelResizeHandleProps,
} from "react-resizable-panels";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/react";

interface ResizeHandleWrapperProps {
  direction: "horizontal" | "vertical";
}
type ResizeHandleProps = ResizeHandleWrapperProps & PanelResizeHandleProps;

const ResizeHandleWapper = styled.div`
  margin: ${(props: ResizeHandleWrapperProps) =>
    props.direction === "horizontal" ? "0 10px" : "10px 0"};
  padding: ${(props: ResizeHandleWrapperProps) =>
    props.direction === "horizontal" ? "0 5px" : "5px 0"};
  opacity: 0.5;
  display: flex;
  border-${(props) =>
    props.direction === "horizontal"
      ? "left"
      : "top"}: 1px solid rgb(255 255 255 / 0.1);
  border-${(props) =>
    props.direction === "horizontal"
      ? "right"
      : "bottom"}: 1px solid rgb(255 255 255 / 0.1);
    display: flex;
    align-items: center;
    flex-direction: ${(props) =>
      props.direction === "horizontal" ? "row" : "column"};
      font-size: 10px;
`;

export const ResizeHandle = (props: ResizeHandleProps) => {
  return (
    <ResizeHandleWapper direction={props.direction}>
      <PanelResizeHandle {...props}>
        {props.direction === "horizontal" ? (
          <>
            <CaretLeftOutlined />
            <CaretRightOutlined />
          </>
        ) : (
          <div>
            <CaretUpOutlined
              css={css`
                display: block;
              `}
            />
            <CaretDownOutlined />
          </div>
        )}
      </PanelResizeHandle>
    </ResizeHandleWapper>
  );
};
