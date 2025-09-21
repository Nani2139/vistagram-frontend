import React from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Icon from "../../atoms/Icon/Icon";

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #dbdbdb;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.75rem 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);

  @media (min-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: auto;
    right: auto;
    border-top: none;
    border-right: 1px solid #dbdbdb;
    flex-direction: column;
    width: 250px;
    height: 100vh;
    padding: 1rem 0;
    justify-content: flex-start;
    gap: 1rem;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: ${(props) => (props.active ? "#262626" : "#8e8e8e")};
  transition: all 0.2s ease;
  min-width: 60px;

  &:hover {
    color: #262626;
    background-color: #f9fafb;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    min-width: auto;
    width: 100%;
  }
`;

const NavLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Logo = styled.div`
  display: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: #262626;
  margin-bottom: 2rem;
  padding: 0 1rem;

  @media (min-width: 768px) {
    display: block;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
  font-size: 0.75rem;
  font-weight: 500;

  &:hover {
    color: #dc2626;
    background-color: #fef2f2;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    min-width: auto;
    width: 100%;
    font-size: 0.875rem;
  }
`;

const Navigation = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
      label: "Home",
    },
    {
      path: "/create",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      label: "Create",
    },
    {
      path: user ? `/profile/${user._id}` : "/login",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Profile",
    },
  ];

  return (
    <NavContainer>
      <Logo>Vistagram</Logo>
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path === "/profile" &&
            location.pathname.startsWith("/profile"));

        return (
          <NavItem key={item.path} to={item.path} active={isActive ? 1 : 0}>
            <Icon size="large">{item.icon}</Icon>
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        );
      })}
      {user && (
        <LogoutButton onClick={handleLogout}>
          <Icon size="large">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </Icon>
          <NavLabel>Logout</NavLabel>
        </LogoutButton>
      )}
    </NavContainer>
  );
};

export default Navigation;
