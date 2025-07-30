import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;
const Input = styled.input`
  flex: 1;
  border-radius: 20px;
  border: 1px solid #222;
  background: #111;
  color: #fff;
  padding: 8px 14px;
  font-size: 15px;
`;
const Button = styled.button`
  background: #1d9bf0;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
`;

export default function ReplyForm({ tweetId }: { tweetId: string }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || value.trim() === "") return;
    setLoading(true);
    try {
      await addDoc(collection(db, "replies"), {
        tweetId,
        userId: user.uid,
        username: user.displayName || "익명",
        reply: value,
        createdAt: Date.now(),
      });
      setValue("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="댓글을 입력하세요..."
        maxLength={180}
        disabled={loading}
      />
      <Button type="submit" disabled={loading || value.trim() === ""}>등록</Button>
    </Form>
  );
}