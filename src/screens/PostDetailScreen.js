import React from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import Navigation from "../components/molecules/Navigation/Navigation";
import PostCard from "../components/molecules/PostCard/PostCard";
import LoadingSpinner from "../components/atoms/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const PostDetailContainer = styled.div`
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
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #262626;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PostWrapper = styled.div`
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #ef4444;
`;

const PostDetailScreen = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch single post
  const {
    data: postData,
    isLoading,
    error,
  } = useQuery(["post", postId], () => api.getPost(postId), {
    enabled: !!postId,
  });

  // Like/Unlike mutation
  const likeMutation = useMutation(
    ({ postId, newIsLikedState }) =>
      newIsLikedState ? api.likePost(postId) : api.unlikePost(postId),
    {
      onSuccess: (data, variables) => {
        // Update the post in cache
        queryClient.setQueryData(["post", variables.postId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              isLiked: data.isLiked,
              likeCount: data.likeCount,
            },
          };
        });
        queryClient.invalidateQueries(["post", variables.postId]);
      },
      onError: (error) => {
        toast.error("Failed to update like");
        console.error("Like error:", error);
      },
    }
  );

  // Share mutation
  const shareMutation = useMutation((postId) => api.sharePost(postId), {
    onSuccess: (data, postId) => {
      // Update the post in cache
      queryClient.setQueryData(["post", postId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            isShared: data.isShared,
            shareCount: data.shareCount,
          },
        };
      });

      // Copy link to clipboard
      const postUrl = `${window.location.origin}/post/${postId}`;
      navigator.clipboard
        .writeText(postUrl)
        .then(() => {
          toast.success("Post link copied to clipboard!");
        })
        .catch(() => {
          toast.success("Post shared successfully!");
        });

      queryClient.invalidateQueries(["post", postId]);
    },
    onError: (error) => {
      toast.error("Failed to share post");
      console.error("Share error:", error);
    },
  });

  // Comment mutation
  const commentMutation = useMutation(
    ({ postId, text }) => api.addComment(postId, text),
    {
      onSuccess: (data, variables) => {
        // Update the post in cache
        queryClient.setQueryData(["post", variables.postId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              commentCount: (oldData.data.commentCount || 0) + 1,
              comments: [...(oldData.data.comments || []), data],
            },
          };
        });
        toast.success("Comment added successfully!");
        queryClient.invalidateQueries(["post", variables.postId]);
      },
      onError: (error) => {
        toast.error("Failed to add comment");
        console.error("Comment error:", error);
      },
    }
  );

  // Handlers
  const handleLike = (postId, newIsLikedState) => {
    likeMutation.mutate({ postId, newIsLikedState });
  };

  const handleShare = (postId) => {
    shareMutation.mutate(postId);
  };

  const handleComment = (postId, text) => {
    if (!text || !text.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    commentMutation.mutate({ postId, text: text.trim() });
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading post..." />;
  }

  if (error) {
    return (
      <PostDetailContainer>
        <Navigation user={user} />
        <MainContent>
          <Header>
            <BackButton onClick={handleBack} aria-label="Go back">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </BackButton>
            <HeaderTitle>Post</HeaderTitle>
          </Header>
          <ContentWrapper>
            <ErrorContainer>
              <h3>Post not found</h3>
              <p>{error.message || "Failed to load post"}</p>
            </ErrorContainer>
          </ContentWrapper>
        </MainContent>
      </PostDetailContainer>
    );
  }

  const post = postData?.data;

  if (!post) {
    return (
      <PostDetailContainer>
        <Navigation user={user} />
        <MainContent>
          <Header>
            <BackButton onClick={handleBack} aria-label="Go back">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </BackButton>
            <HeaderTitle>Post</HeaderTitle>
          </Header>
          <ContentWrapper>
            <ErrorContainer>
              <h3>Post not found</h3>
              <p>
                The post you're looking for doesn't exist or has been removed.
              </p>
            </ErrorContainer>
          </ContentWrapper>
        </MainContent>
      </PostDetailContainer>
    );
  }

  return (
    <PostDetailContainer>
      <Navigation user={user} />

      <MainContent>
        <Header>
          <BackButton onClick={handleBack} aria-label="Go back">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </BackButton>
          <HeaderTitle>Post</HeaderTitle>
        </Header>

        <ContentWrapper>
          <PostWrapper>
            <PostCard
              post={post}
              onLike={handleLike}
              onShare={handleShare}
              onComment={handleComment}
              onUserClick={handleUserClick}
            />
          </PostWrapper>
        </ContentWrapper>
      </MainContent>
    </PostDetailContainer>
  );
};

export default PostDetailScreen;
