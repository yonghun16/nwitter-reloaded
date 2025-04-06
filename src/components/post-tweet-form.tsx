import styled from "styled-components"
import { useState } from "react"
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;  /* resize 기능 제거 */
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  padding: 10px 0px;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin-top: 10px;
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);   // 미리보기

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const selectedFile = files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // ✅ Base64 미리보기 저장
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // 이미지 600KB 이하로 압축
  const compressImage = (file: File, maxSizeInKB = 600): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas context not available");

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let quality = 0.9;
          let base64 = canvas.toDataURL("image/jpeg", quality);

          // 반복적으로 압축하여 600KB 이하 만들기
          while (base64.length > maxSizeInKB * 1024 && quality > 0.1) {
            quality -= 0.05;
            base64 = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(base64);
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Submit
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);

      let base64Image = null;
      if (file) {
        base64Image = await compressImage(file); // ✅ 압축된 이미지 사용
      }

      await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        image: base64Image,
      });

      setTweet("");
      setFile(null);
      setPreview(null); // ✅ 미리보기 초기화
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What's happening?"
      />
      <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add photo"} </ AttachFileButton>
      <AttachFileInput
        type="file"
        onChange={onFileChange}
        id="file"
        accept="image/*"
      />
      {preview && <ImagePreview src={preview} alt="Preview" />}
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
    </Form>
  );
}
