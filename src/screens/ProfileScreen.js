import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import Navigation from "../components/molecules/Navigation/Navigation";
import Avatar from "../components/atoms/Avatar/Avatar";
import Button from "../components/atoms/Button/Button";
import LoadingSpinner from "../components/atoms/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const ProfileContainer = styled.div`
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

const ProfileHeader = styled.div`
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    gap: 2rem;
  }
`;

const AvatarSection = styled.div`
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const Bio = styled.p`
  color: #8e8e8e;
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #262626;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #8e8e8e;
`;

const ActionButton = styled(Button)`
  @media (min-width: 768px) {
    width: auto;
    min-width: 120px;
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PostThumbnail = styled.div`
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #8e8e8e;
`;

const ProfileScreen = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Debug logging
  console.log("ProfileScreen - userId:", userId);
  console.log("ProfileScreen - currentUser:", currentUser);

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery(["user", userId], () => api.getUser(userId), {
    enabled: !!userId,
  });

  const { data: postsData } = useQuery(
    ["userPosts", userId],
    () => api.getUserPosts(userId, 1, 12),
    {
      enabled: !!userId,
    }
  );

  // Follow/Unfollow mutation
  const followMutation = useMutation(() => api.followUser(userId), {
    onSuccess: (data) => {
      // Update the profile data in cache
      queryClient.setQueryData(["user", userId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            isFollowing: data.data.isFollowing,
            user: {
              ...oldData.data.user,
              followerCount: data.data.followerCount,
            },
          },
        };
      });

      toast.success(data.message);
      queryClient.invalidateQueries(["user", userId]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update follow status");
      console.error("Follow error:", error);
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (error) {
    return (
      <ProfileContainer>
        <Navigation user={currentUser} />
        <MainContent>
          <ContentWrapper>
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}
            >
              <h3>Profile not found</h3>
              <p>{error.message || "Failed to load profile"}</p>
            </div>
          </ContentWrapper>
        </MainContent>
      </ProfileContainer>
    );
  }

  const user = profileData?.data?.user;
  const posts = postsData?.data?.posts || [];
  const isOwnProfile = currentUser?._id === userId;
  const isFollowing = profileData?.data?.isFollowing || false;

  const handleFollow = () => {
    followMutation.mutate();
  };

  return (
    <ProfileContainer>
      <Navigation user={currentUser} />

      <MainContent>
        <Header>
          <HeaderTitle>{user?.username || "Profile"}</HeaderTitle>
        </Header>

        <ContentWrapper>
          <ProfileHeader>
            <ProfileInfo>
              <AvatarSection>
                <Avatar
                  src={user?.profilePicture}
                  username={user?.username}
                  size="xxlarge"
                />
              </AvatarSection>

              <UserDetails>
                <Username>{user?.username}</Username>
                {user?.bio && <Bio>{user.bio}</Bio>}

                <Stats>
                  <Stat>
                    <StatNumber>{user?.postCount || 0}</StatNumber>
                    <StatLabel>posts</StatLabel>
                  </Stat>
                  <Stat>
                    <StatNumber>{user?.followerCount || 0}</StatNumber>
                    <StatLabel>followers</StatLabel>
                  </Stat>
                  <Stat>
                    <StatNumber>{user?.followingCount || 0}</StatNumber>
                    <StatLabel>following</StatLabel>
                  </Stat>
                </Stats>

                {!isOwnProfile && (
                  <ActionButton
                    variant={isFollowing ? "secondary" : "primary"}
                    fullWidth
                    onClick={handleFollow}
                    disabled={followMutation.isLoading}
                  >
                    {followMutation.isLoading
                      ? "Loading..."
                      : isFollowing
                      ? "Following"
                      : "Follow"}
                  </ActionButton>
                )}
              </UserDetails>
            </ProfileInfo>
          </ProfileHeader>

          {posts.length > 0 ? (
            <PostsGrid>
              {posts.map((post) => (
                <PostThumbnail key={post._id}>
                  <PostImage src={post.image} alt={post.caption} />
                </PostThumbnail>
              ))}
            </PostsGrid>
          ) : (
            <EmptyState>
              <h3>No posts yet</h3>
              <p>When {user?.username} shares photos, you'll see them here.</p>
            </EmptyState>
          )}
        </ContentWrapper>
      </MainContent>
    </ProfileContainer>
  );
};

export default ProfileScreen;
