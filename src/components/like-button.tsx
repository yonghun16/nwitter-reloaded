import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import styled from "styled-components";

const LikeButton = styled.button<{ isLiked: boolean }>`
  background: none;
  border: none;
  color: ${props => props.isLiked ? '#e0245e' : '#8899a6'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 14px;
  
  &:hover {
    background: ${props => props.isLiked ? 'rgba(224,36,94,0.1)' : 'rgba(29,155,240,0.1)'};
    color: ${props => props.isLiked ? '#e0245e' : '#1d9bf0'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const HeartIcon = styled.span<{ isLiked: boolean }>`
  font-size: 16px;
  transition: all 0.2s ease;
  ${props => props.isLiked && `
    animation: heartBeat 0.3s ease;
  `}
  
  @keyframes heartBeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
`;

const LikeCount = styled.span`
  font-size: 14px;
  color: #8899a6;
`;

interface LikeButtonProps {
  tweetId: string;
}

export default function LikeButtonComponent({ tweetId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;

  // 좋아요 상태 확인
  useEffect(() => {
    if (!user) return;

    const checkLikeStatus = async () => {
      const likeQuery = query(
        collection(db, "likes"),
        where("tweetId", "==", tweetId),
        where("userId", "==", user.uid)
      );
      
      const snapshot = await getDocs(likeQuery);
      setIsLiked(!snapshot.empty);
    };

    checkLikeStatus();
  }, [tweetId, user]);

  // 좋아요 수 실시간 업데이트
  useEffect(() => {
    const likeQuery = query(
      collection(db, "likes"),
      where("tweetId", "==", tweetId)
    );

    const unsub = onSnapshot(likeQuery, (snapshot) => {
      setLikeCount(snapshot.size);
    });

    return () => unsub();
  }, [tweetId]);

  const handleLike = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    // 즉시 UI 업데이트 (optimistic update)
    setIsLiked(!isLiked);
    
    try {
      if (!isLiked) {
        // 좋아요 추가
        await addDoc(collection(db, "likes"), {
          tweetId,
          userId: user.uid,
          createdAt: Date.now(),
        });
      } else {
        // 좋아요 취소
        const likeQuery = query(
          collection(db, "likes"),
          where("tweetId", "==", tweetId),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(likeQuery);
        if (!snapshot.empty) {
          await deleteDoc(doc(db, "likes", snapshot.docs[0].id));
        }
      }
    } catch (error) {
      console.error("Like error:", error);
      // 에러 발생 시 원래 상태로 되돌리기
      setIsLiked(isLiked);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <LikeButton 
      onClick={handleLike} 
      isLiked={isLiked}
      disabled={isLoading}
    >
      <HeartIcon isLiked={isLiked}>
        {isLiked ? '❤️' : '🤍'}
      </HeartIcon>
      {likeCount > 0 && <LikeCount>{likeCount}</LikeCount>}
    </LikeButton>
  );
} 