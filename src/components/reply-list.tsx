import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import styled from "styled-components";

const List = styled.div`
  margin-top: 12px;
  padding-left: 8px;
  border-left: 2px solid #222;
`;
const ReplyItem = styled.div`
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #222;
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;
const Author = styled.span`
  font-weight: 600;
  color: #1d9bf0;
  margin-right: 8px;
`;
const Time = styled.span`
  color: #aaa;
  font-size: 12px;
  margin-left: 8px;
`;
const ActionBtn = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 12px;
  margin-left: 6px;
  cursor: pointer;
  &:hover { color: #e74c3c; text-decoration: underline; }
`;
const EditInput = styled.input`
  flex: 1;
  border-radius: 12px;
  border: 1px solid #222;
  background: #111;
  color: #fff;
  padding: 4px 10px;
  font-size: 15px;
`;

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString("ko-KR", { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
}

export function useReplyCount(tweetId: string) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const q = query(collection(db, "replies"), where("tweetId", "==", tweetId));
    const unsub = onSnapshot(q, (snap) => setCount(snap.size));
    return () => unsub();
  }, [tweetId]);
  return count;
}

export default function ReplyList({ tweetId }: { tweetId: string }) {
  const [replies, setReplies] = useState<any[]>([]);
  const [editId, setEditId] = useState<string|null>(null);
  const [editValue, setEditValue] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(db, "replies"),
      where("tweetId", "==", tweetId),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [tweetId]);

  const onDelete = async (id: string) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    await deleteDoc(doc(db, "replies", id));
  };

  const onEdit = (id: string, value: string) => {
    setEditId(id);
    setEditValue(value);
  };
  const onEditSave = async (id: string) => {
    setEditLoading(true);
    await updateDoc(doc(db, "replies", id), { reply: editValue });
    setEditId(null);
    setEditValue("");
    setEditLoading(false);
  };

  if (replies.length === 0) return null;

  return (
    <List>
      {replies.map(r => (
        <ReplyItem key={r.id}>
          <Author>{r.username}</Author>
          {editId === r.id ? (
            <>
              <EditInput value={editValue} onChange={e=>setEditValue(e.target.value)} disabled={editLoading} />
              <ActionBtn onClick={()=>onEditSave(r.id)} disabled={editLoading || editValue.trim() === r.reply.trim()}>저장</ActionBtn>
              <ActionBtn onClick={()=>setEditId(null)} disabled={editLoading}>취소</ActionBtn>
            </>
          ) : (
            <>
              {r.reply}
              <Time>{formatTime(r.createdAt)}</Time>
              {user && user.uid === r.userId && (
                <>
                  <ActionBtn onClick={()=>onEdit(r.id, r.reply)}>수정</ActionBtn>
                  <ActionBtn onClick={()=>onDelete(r.id)}>삭제</ActionBtn>
                </>
              )}
            </>
          )}
        </ReplyItem>
      ))}
    </List>
  );
}