import React from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.5rem 1rem";
      case "large":
        return "1rem 2rem";
      default:
        return "0.75rem 1.5rem";
    }
  }};
  border-radius: 8px;
  font-weight: 600;
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
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  position: relative;
  overflow: hidden;
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
  min-width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  ${(props) => {
    switch (props.variant) {
      case "primary":
        return css`
          background: linear-gradient(135deg, #0095f6 0%, #1877f2 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 149, 246, 0.2);

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #1877f2 0%, #0095f6 100%);
            box-shadow: 0 4px 12px rgba(0, 149, 246, 0.3);
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 149, 246, 0.2);
          }
        `;
      case "secondary":
        return css`
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;

          &:hover:not(:disabled) {
            background: #e5e7eb;
            border-color: #9ca3af;
          }
        `;
      case "ghost":
        return css`
          background: transparent;
          color: #6b7280;

          &:hover:not(:disabled) {
            background: #f9fafb;
            color: #374151;
          }
        `;
      case "danger":
        return css`
          background: #ef4444;
          color: white;

          &:hover:not(:disabled) {
            background: #dc2626;
            transform: translateY(-1px);
          }
        `;
      default:
        return css`
          background: #ffffff;
          color: #262626;
          border: 1px solid #dbdbdb;

          &:hover:not(:disabled) {
            background: #fafafa;
            border-color: #a8a8a8;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus-visible {
    outline: 2px solid #0095f6;
    outline-offset: 2px;
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button = ({
  children,
  variant = "default",
  size = "medium",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const handleClick = (e) => {
    if (!loading && !disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};

export default Button;
