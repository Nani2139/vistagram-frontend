import React from "react";
import styled from "styled-components";
import PostFeed from "../components/organisms/PostFeed/PostFeed";
import Navigation from "../components/molecules/Navigation/Navigation";
import { useAuth } from "../contexts/AuthContext";

const HomePageContainer = styled.div`
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
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem 0;

  @media (min-width: 768px) {
    padding: 2rem 0;
  }
`;

const HomePageUI = ({ screenData, screenActions }) => {
  const { user } = useAuth();

  return (
    <HomePageContainer>
      <Navigation user={user} />

      <MainContent>
        <Header>
          <HeaderTitle>Vistagram</HeaderTitle>
        </Header>

        <ContentWrapper>
          <PostFeed
            posts={screenData.posts}
            loading={screenData.loading}
            error={screenData.error}
            hasNextPage={screenData.hasNextPage}
            isFetchingNextPage={screenData.isFetchingNextPage}
            onLike={screenActions.onLike}
            onShare={screenActions.onShare}
            onComment={screenActions.onComment}
            onUserClick={screenActions.onUserClick}
            onRefresh={screenActions.onRefresh}
            onLoadMore={screenActions.onLoadMore}
          />
        </ContentWrapper>
      </MainContent>
    </HomePageContainer>
  );
};

export default HomePageUI;
