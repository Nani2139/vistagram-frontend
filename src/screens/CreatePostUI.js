import React from "react";
import styled from "styled-components";
import CreatePost from "../components/organisms/CreatePost/CreatePost";
import Navigation from "../components/molecules/Navigation/Navigation";
import { useAuth } from "../contexts/AuthContext";

const CreatePostContainer = styled.div`
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding-bottom: 80px; /* Space for mobile navigation */

  @media (min-width: 768px) {
    padding-bottom: 0;
    margin-left: 250px; /* Width of desktop navigation */
  }
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #dbdbdb;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);

  @media (min-width: 768px) {
    display: none;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
  text-align: center;
`;

const ContentWrapper = styled.div`
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const CreatePostUI = ({ screenData, screenActions }) => {
  const { user } = useAuth();

  return (
    <CreatePostContainer>
      <Navigation user={user} />

      <MainContent>
        <Header>
          <HeaderTitle>Create Post</HeaderTitle>
        </Header>

        <ContentWrapper>
          <CreatePost
            onSubmit={screenActions.onSubmit}
            onCancel={screenActions.onCancel}
            loading={screenData.loading}
          />
        </ContentWrapper>
      </MainContent>
    </CreatePostContainer>
  );
};

export default CreatePostUI;
