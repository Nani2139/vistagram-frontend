import React from "react";
import styled from "styled-components";

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color || "currentColor"};
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.size) {
      case "small":
        return `
          width: 1rem;
          height: 1rem;
          font-size: 1rem;
        `;
      case "medium":
        return `
          width: 1.25rem;
          height: 1.25rem;
          font-size: 1.25rem;
        `;
      case "large":
        return `
          width: 1.5rem;
          height: 1.5rem;
          font-size: 1.5rem;
        `;
      case "xlarge":
        return `
          width: 2rem;
          height: 2rem;
          font-size: 2rem;
        `;
      default:
        return `
          width: 1.25rem;
          height: 1.25rem;
          font-size: 1.25rem;
        `;
    }
  }}

  ${(props) =>
    props.clickable &&
    `
    cursor: pointer;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
  `}

  ${(props) =>
    props.rotate &&
    `
    transform: rotate(${props.rotate}deg);
  `}
`;

const Icon = ({
  children,
  size = "medium",
  color,
  clickable = false,
  rotate = 0,
  onClick,
  ...props
}) => {
  return (
    <IconContainer
      size={size}
      color={color}
      clickable={clickable}
      rotate={rotate}
      onClick={onClick}
      {...props}
    >
      {children}
    </IconContainer>
  );
};

export default Icon;
