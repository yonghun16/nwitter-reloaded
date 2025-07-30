/* library import */
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, Unsubscribe, onSnapshot, limit, orderBy, query, where, doc, setDoc, getDoc, deleteDoc, getDocs } from "firebase/firestore";
import { deleteUser, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import compressImage from "../components/compress-img";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";


/* styled components */
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const DeleteAccountButton = styled.button`
  background-color: #e0245e;
  color: white;
  font-weight: 600;
  border: none;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #c01e4e;
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const EditProfileButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: none;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #1a8cd8;
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
`;

const EditProfileModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const EditModalContent = styled.div`
  background: #222;
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
`;

const EditModalTitle = styled.h3`
  color: #fff;
  margin: 0 0 24px 0;
  font-size: 20px;
  text-align: center;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background: #111;
  color: #fff;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const EditLabel = styled.label`
  color: #fff;
  font-weight: 600;
  font-size: 14px;
`;

const EditModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
`;

const EditModalButton = styled.button<{ isPrimary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => props.isPrimary ? '#1d9bf0' : '#555'};
  color: white;
  
  &:hover {
    background-color: ${props => props.isPrimary ? '#1a8cd8' : '#666'};
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const DeleteConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #222;
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: #fff;
  margin: 0 0 16px 0;
  font-size: 20px;
`;

const ModalText = styled.p`
  color: #ccc;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled.button<{ isDanger?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => props.isDanger ? '#e0245e' : '#555'};
  color: white;
  
  &:hover {
    background-color: ${props => props.isDanger ? '#c01e4e' : '#666'};
  }
`;


/* Profile component */
export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL ?? undefined);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.displayName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfileAvatar = async () => {
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.avatarBase64) {
          setAvatar(data.avatarBase64);  // img src로 직접 사용 가능
        }
      }
    };

    fetchProfileAvatar();
    fetchTweets();
  }, []);

  // onAvatarChange Event
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1 && files[0].size > 0) {
      let base64Image = null;
      const file = files[0];

      base64Image = await compressImage(file);      // ✅ 압축된 이미지 사용

      setAvatar(base64Image);

      await setDoc(doc(db, "users", user.uid), {    // 
        avatarBase64: base64Image                   // avatarBase64 필드에 압축된 base64 문자열을 저장
      }, { merge: true });                          // 기존 문서 병합
    }
  }

  // 내 트윗 가져오기
  const fetchTweets = async () => {
    let unsubscribe: Unsubscribe | null = null;    // Firestore의 onSnapshot 리스너를 해제하기 위한 unsubscribe 함수를 저장할 변수

    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );

    unsubscribe = onSnapshot(tweetQuery, (snapshot) => {                     // tweetsQuery 조건에 맞는 데이터를 가져오고, 해당 데이터에 변경이 생기면 자동으로 다시 실행
      const tweets = snapshot.docs.map((doc) => {                             // snapshot.docs 배열을 순회하며 각 문서를 tweet 객체로 매핑
        const { tweet, createdAt, username, userId, image } = doc.data();
        return { tweet, createdAt, username, userId, image, id: doc.id };     // doc 객체 반환
      });
      setTweets(tweets);
    });

    return () => {
      unsubscribe && unsubscribe();        // unsubscribe가 null, undefined가 아닐 때만 unsubscribe()를 실행하여 구독 취소
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // 사용자 데이터 삭제
      await deleteDoc(doc(db, "users", user.uid));

      // 트윗 데이터 삭제
      const tweetsRef = collection(db, "tweets");
      const tweetsSnap = await getDocs(tweetsRef);
      tweetsSnap.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // 좋아요 데이터 삭제
      const likesRef = collection(db, "likes");
      const likesSnap = await getDocs(likesRef);
      likesSnap.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // 댓글 데이터 삭제
      const commentsRef = collection(db, "comments");
      const commentsSnap = await getDocs(commentsRef);
      commentsSnap.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // 사용자 계정 삭제
      await deleteUser(user);

      alert("계정이 성공적으로 삭제되었습니다.");
      navigate("/"); // 홈으로 리다이렉트
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("계정 삭제에 실패했습니다.");
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editName.trim()) return;

    setIsSaving(true);
    try {
      // Firestore에 사용자 정보 업데이트
      await setDoc(doc(db, "users", user.uid), {
        displayName: editName.trim(),
        updatedAt: Date.now(),
      }, { merge: true });

      // Firebase Auth의 displayName 업데이트
      await updateProfile(user, {
        displayName: editName.trim()
      });

      setIsEditModalOpen(false);
      alert("프로필이 성공적으로 수정되었습니다.");
      // 페이지 새로고침으로 변경사항 반영
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // render
  return (
    <Wrapper>

      <AvatarUpload htmlFor="avatar">
        {Boolean(avatar)
          ? <AvatarImg src={avatar} />
          : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        }
      </AvatarUpload>

      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />

      <Name>
        {user?.displayName ?? "Anonymous"}
      </Name>

      <ButtonContainer>
        <EditProfileButton onClick={() => setIsEditModalOpen(true)}>
          프로필 수정
        </EditProfileButton>

        <DeleteAccountButton onClick={() => setIsModalOpen(true)}>
          계정 삭제
        </DeleteAccountButton>
      </ButtonContainer>

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>

      {isEditModalOpen && (
        <EditProfileModal onClick={() => setIsEditModalOpen(false)}>
          <EditModalContent onClick={(e) => e.stopPropagation()}>
            <EditModalTitle>프로필 수정</EditModalTitle>
            <EditForm onSubmit={handleEditProfile}>
              <div>
                <EditLabel>이름</EditLabel>
                <EditInput
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  maxLength={20}
                  disabled={isSaving}
                />
              </div>
              <EditModalButtons>
                <EditModalButton 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                >
                  취소
                </EditModalButton>
                <EditModalButton 
                  type="submit" 
                  isPrimary
                  disabled={isSaving || !editName.trim()}
                >
                  {isSaving ? "저장 중..." : "저장"}
                </EditModalButton>
              </EditModalButtons>
            </EditForm>
          </EditModalContent>
        </EditProfileModal>
      )}

      {isModalOpen && (
        <DeleteConfirmModal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>계정 삭제</ModalTitle>
            <ModalText>
              이 계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
              이 작업은 되돌릴 수 없습니다.
            </ModalText>
            <ModalButtons>
              <ModalButton onClick={() => setIsModalOpen(false)}>취소</ModalButton>
              <ModalButton isDanger onClick={handleDeleteAccount}>삭제</ModalButton>
            </ModalButtons>
          </ModalContent>
        </DeleteConfirmModal>
      )}

    </Wrapper>
  );
}
