import React from "react";
import styled from "styled-components";

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f3f4f6;
  border: 2px solid transparent;
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.size) {
      case "small":
        return `
          width: 2rem;
          height: 2rem;
        `;
      case "medium":
        return `
          width: 2.5rem;
          height: 2.5rem;
        `;
      case "large":
        return `
          width: 3rem;
          height: 3rem;
        `;
      case "xlarge":
        return `
          width: 4rem;
          height: 4rem;
        `;
      case "xxlarge":
        return `
          width: 6rem;
          height: 6rem;
        `;
      default:
        return `
          width: 2.5rem;
          height: 2.5rem;
        `;
    }
  }}

  ${(props) =>
    props.clickable &&
    `
    cursor: pointer;
    
    &:hover {
      border-color: #0095f6;
      transform: scale(1.05);
    }
  `}

  ${(props) =>
    props.border &&
    `
    border-color: #dbdbdb;
  `}
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.75rem";
      case "medium":
        return "0.875rem";
      case "large":
        return "1rem";
      case "xlarge":
        return "1.25rem";
      case "xxlarge":
        return "1.5rem";
      default:
        return "0.875rem";
    }
  }};
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.5rem";
      case "medium":
        return "0.625rem";
      case "large":
        return "0.75rem";
      case "xlarge":
        return "1rem";
      case "xxlarge":
        return "1.25rem";
      default:
        return "0.625rem";
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.5rem";
      case "medium":
        return "0.625rem";
      case "large":
        return "0.75rem";
      case "xlarge":
        return "1rem";
      case "xxlarge":
        return "1.25rem";
      default:
        return "0.625rem";
    }
  }};
  background-color: #22c55e;
  border: 2px solid white;
  border-radius: 50%;
`;

const Avatar = ({
  src,
  alt = "Avatar",
  size = "medium",
  clickable = false,
  border = false,
  online = false,
  username,
  ...props
}) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AvatarContainer
      size={size}
      clickable={clickable}
      border={border}
      {...props}
    >
      {src ? (
        <AvatarImage src={src} alt={alt} />
      ) : (
        <AvatarPlaceholder size={size}>
          {getInitials(username || alt)}
        </AvatarPlaceholder>
      )}
      {online && <OnlineIndicator size={size} />}
    </AvatarContainer>
  );
};

export default Avatar;
