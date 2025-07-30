/* library import */
import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import compressImage from "./compress-img";
import ReplyList, { useReplyCount } from "./reply-list";
import ReplyForm from "./reply-form";
import LikeButtonComponent from "./like-button";
import toast from "react-hot-toast";


/* styled components */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #000;
`;

const Column = styled.div`
  width: 100%;
`;

const Photo = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 15px;
  margin-top: 12px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 8px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: #222;
  padding: 32px 24px;
  border-radius: 12px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const ModalInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #111;
  color: #fff;
  padding: 8px;
  font-size: 16px;
`;
const ModalButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;
const ModalButton = styled.button`
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;
const ModalImagePreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 8px;
`;
const ModalImageInput = styled.input`
  margin-bottom: 8px;
`;
const RemoveImageButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
`;

const ReplyButton = styled.button`
  background: none;
  color: #1d9bf0;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  text-transform: uppercase;
  &:hover { 
    background: rgba(29,155,240,0.1);
    text-decoration: none;
  }
`;


/* Tweet component */
export default function Tweet({ username, image, tweet, userId, id }: ITweet) {    // props
  const user = auth.currentUser;                  // 현재 로그인된 사용자의 정보 불러옴
  const [isEditOpen, setEditOpen] = useState(false);
  const [editValue, setEditValue] = useState(tweet);
  const [editImage, setEditImage] = useState<string | undefined>(image);
  const [isSaving, setIsSaving] = useState(false);
  const [isImgLoading, setImgLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const replyCount = useReplyCount(id);

  // onDelete function
  const onDelete = async () => {
    const ok = confirm("Are you sure?");

    if (!ok || !user || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));     // Firestore의 document를 삭제
    } catch(error) {
      console.log(error);
    } finally {

    }
  }

  // 이미지 변경 핸들러
  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgLoading(true);
    try {
      const base64 = await compressImage(file);
      setEditImage(base64);
    } catch (err) {
      toast.error("이미지 처리 실패");
    } finally {
      setImgLoading(false);
    }
  };

  // onEditSave function
  const onEditSave = async () => {
    if (!user || user.uid !== userId) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "tweets", id), { tweet: editValue, image: editImage ?? "" });
      setEditOpen(false);
      toast.success("트윗이 수정되었습니다.");
    } catch (error) {
      toast.error("수정 실패: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // render
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {image && <Photo src={`${image}`} />}
        <div style={{display:'flex', alignItems:'center', gap:8, marginTop: '12px'}}>
          <ReplyButton onClick={() => setShowReplies(v => !v)}>
            댓글{replyCount > 0 ? `(${replyCount})` : ""}
          </ReplyButton>
          <LikeButtonComponent tweetId={id} />
          {user?.uid === userId ? (
            <>
              <DeleteButton onClick={onDelete}>Delete</DeleteButton>
              <EditButton onClick={() => setEditOpen(true)}>Edit</EditButton>
            </>
          ) : null}
        </div>
        {showReplies && (
          <>
            <ReplyList tweetId={id} />
            <ReplyForm tweetId={id} />
          </>
        )}
      </Column>
      {isEditOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3 style={{color: '#fff', margin: 0}}>트윗 수정</h3>
            <ModalInput
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              disabled={isSaving}
              maxLength={280}
            />
            {/* 이미지 미리보기 및 업로드 */}
            {editImage && (
              <div style={{display:'flex', alignItems:'center'}}>
                <ModalImagePreview src={editImage} alt="미리보기" />
                <RemoveImageButton onClick={() => setEditImage(undefined)} disabled={isSaving || isImgLoading}>이미지 삭제</RemoveImageButton>
              </div>
            )}
            <ModalImageInput
              type="file"
              accept="image/*"
              onChange={onImageChange}
              disabled={isSaving || isImgLoading}
            />
            {isImgLoading && <span style={{color:'#fff', fontSize:12}}>이미지 처리 중...</span>}
            <ModalButtonRow>
              <ModalButton onClick={() => setEditOpen(false)} disabled={isSaving || isImgLoading} style={{background:'#555', color:'#fff'}}>취소</ModalButton>
              <ModalButton onClick={onEditSave} disabled={isSaving || isImgLoading || (editValue.trim() === tweet.trim() && (editImage ?? "") === (image ?? ""))} style={{background:'#1d9bf0', color:'#fff'}}>저장</ModalButton>
            </ModalButtonRow>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  )
}
