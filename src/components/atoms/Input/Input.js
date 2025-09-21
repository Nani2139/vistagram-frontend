import React, { forwardRef } from "react";
import styled, { css } from "styled-components";

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.5rem 0.75rem";
      case "large":
        return "1rem 1.25rem";
      default:
        return "0.75rem 1rem";
    }
  }};
  border: 1px solid ${(props) => (props.error ? "#ef4444" : "#dbdbdb")};
  border-radius: 8px;
  font-size: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.875rem";
      case "large":
        return "1.125rem";
      default:
        return "1rem";
    }
  }};
  line-height: 1.5;
  background-color: ${(props) => (props.disabled ? "#f9fafb" : "#ffffff")};
  color: ${(props) => (props.disabled ? "#9ca3af" : "#262626")};
  transition: all 0.2s ease;
  min-height: ${(props) => {
    switch (props.size) {
      case "small":
        return "2rem";
      case "large":
        return "3rem";
      default:
        return "2.5rem";
    }
  }};

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #0095f6;
    box-shadow: 0 0 0 3px rgba(0, 149, 246, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #f9fafb;
  }

  ${(props) =>
    props.error &&
    css`
      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    `}
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

const HelperText = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      size = "medium",
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <InputContainer className={className}>
        {label && <Label>{label}</Label>}
        <StyledInput
          ref={ref}
          size={size}
          error={error}
          disabled={disabled}
          {...props}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputContainer>
    );
  }
);

Input.displayName = "Input";

export default Input;
