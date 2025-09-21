import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Avatar from "../../atoms/Avatar/Avatar";
import Icon from "../../atoms/Icon/Icon";
import FallbackImage from "../../atoms/FallbackImage/FallbackImage";
import CommentModal from "../CommentModal/CommentModal";

const PostContainer = styled(motion.article)`
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.75rem;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Username = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostTime = styled.time`
  font-size: 0.75rem;
  color: #8e8e8e;
  display: block;
  margin-top: 0.125rem;
`;

const PostImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background-color: #f3f4f6;
  overflow: hidden;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: ${(props) => (props.active ? "#ed4956" : "#262626")};

  &:hover {
    background-color: #f9fafb;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ActionCount = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #262626;
`;

const PostContent = styled.div`
  padding: 0 1rem 1rem;
`;

const Caption = styled.p`
  font-size: 0.875rem;
  line-height: 1.4;
  color: #262626;
  margin: 0;
  word-wrap: break-word;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #8e8e8e;
`;

const PostCard = ({
  post,
  onLike,
  onShare,
  onComment,
  onUserClick,
  className,
}) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleLike = () => {
    if (onLike) {
      onLike(post._id, !post.isLiked);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post._id);
    }
  };

  const handleComment = () => {
    setIsCommentModalOpen(true);
  };

  const handleCommentSubmit = (commentText) => {
    if (onComment) {
      onComment(post._id, commentText);
    }
  };

  const handleUserClick = () => {
    if (onUserClick && post.user?._id) {
      onUserClick(post.user._id);
    }
  };

  return (
    <PostContainer
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PostHeader>
        <Avatar
          src={post.user?.profilePicture}
          username={post.user?.username}
          size="medium"
          clickable
          onClick={handleUserClick}
        />
        <UserInfo>
          <Username onClick={handleUserClick} style={{ cursor: "pointer" }}>
            {post.user?.username}
          </Username>
          <PostTime>
            {post.createdAt
              ? formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })
              : "Just now"}
          </PostTime>
        </UserInfo>
      </PostHeader>

      <PostImage>
        <FallbackImage src={post.image} alt={post.caption} />
      </PostImage>

      <PostActions>
        <ActionButton
          active={post.isLiked}
          onClick={handleLike}
          aria-label={post.isLiked ? "Unlike" : "Like"}
        >
          <Icon size="large">
            {post.isLiked ? (
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </Icon>
          <ActionCount>{post.likeCount || 0}</ActionCount>
        </ActionButton>

        <ActionButton onClick={handleComment} aria-label="Comment">
          <Icon size="large">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Icon>
          <ActionCount>{post.commentCount || 0}</ActionCount>
        </ActionButton>

        <ActionButton
          active={post.isShared}
          onClick={handleShare}
          aria-label="Share"
        >
          <Icon size="large">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </Icon>
          <ActionCount>{post.shareCount || 0}</ActionCount>
        </ActionButton>
      </PostActions>

      <PostContent>
        <Caption>{post.caption}</Caption>
        {post.location?.name && (
          <Location>
            <Icon size="small">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </Icon>
            {post.location.name}
          </Location>
        )}
      </PostContent>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onSubmit={handleCommentSubmit}
      />
    </PostContainer>
  );
};

export default PostCard;
