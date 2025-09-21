import React, { useState } from "react";
import styled from "styled-components";
import PostCard from "../../molecules/PostCard/PostCard";
import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";

const FeedContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #0095f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  gap: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  gap: 1rem;
`;

const PostFeed = ({
  posts = [],
  loading = false,
  error = null,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLike,
  onShare,
  onComment,
  onUserClick,
  onRefresh,
  onLoadMore,
  className,
}) => {
  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore();
    }
  };

  if (loading) {
    return (
      <FeedContainer className={className}>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading posts...</p>
        </LoadingContainer>
      </FeedContainer>
    );
  }

  if (error) {
    return (
      <FeedContainer className={className}>
        <ErrorContainer>
          <Icon size="xlarge" color="#ef4444">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </Icon>
          <div>
            <h3>Something went wrong</h3>
            <p>{error?.message || "Failed to load posts"}</p>
          </div>
          <Button variant="primary" onClick={handleRefresh}>
            Try Again
          </Button>
        </ErrorContainer>
      </FeedContainer>
    );
  }

  if (posts.length === 0) {
    return (
      <FeedContainer className={className}>
        <EmptyState>
          <Icon size="xlarge" color="#9ca3af">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </Icon>
          <div>
            <h3>No posts yet</h3>
            <p>Be the first to share a Point of Interest!</p>
          </div>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/create")}
          >
            Create First Post
          </Button>
        </EmptyState>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer className={className}>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={onLike}
          onShare={onShare}
          onComment={onComment}
          onUserClick={onUserClick}
        />
      ))}

      {isFetchingNextPage && (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading more posts...</p>
        </LoadingContainer>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Button variant="secondary" onClick={handleLoadMore}>
            Load More Posts
          </Button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div
          style={{ textAlign: "center", marginTop: "2rem", color: "#9ca3af" }}
        >
          <p>You've reached the end!</p>
        </div>
      )}
    </FeedContainer>
  );
};

export default PostFeed;
