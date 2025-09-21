import React from "react";
import styled from "styled-components";
import Navigation from "../components/molecules/Navigation/Navigation";
import { useAuth } from "../contexts/AuthContext";

const ActivityContainer = styled.div`
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
  padding-bottom: 80px;

  @media (min-width: 768px) {
    padding-bottom: 0;
    margin-left: 250px;
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
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ComingSoon = styled.div`
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  margin-top: 2rem;
`;

const ComingSoonTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 1rem 0;
`;

const ComingSoonText = styled.p`
  color: #8e8e8e;
  margin: 0;
  line-height: 1.5;
`;

const ActivityScreen = () => {
  const { user } = useAuth();

  return (
    <ActivityContainer>
      <Navigation user={user} />

      <MainContent>
        <Header>
          <HeaderTitle>Activity</HeaderTitle>
        </Header>

        <ContentWrapper>
          <ComingSoon>
            <ComingSoonTitle>Activity Coming Soon</ComingSoonTitle>
            <ComingSoonText>
              Stay updated with likes, comments, and follows. This feature will
              show you all the activity related to your posts and profile.
            </ComingSoonText>
          </ComingSoon>
        </ContentWrapper>
      </MainContent>
    </ActivityContainer>
  );
};

export default ActivityScreen;
