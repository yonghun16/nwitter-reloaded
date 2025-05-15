/* library import */
import styled from "styled-components"
import { useState } from "react"
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import compressImage from "./compress-img";

/* styled components */
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
  resize: none;          /* resize 기능 제거(textarea 크기 사용자가 임의로 조절 불가능하도록) */
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


/* PostTweetForm component */
export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);           // file 상태의 타입은 File이거나 null일 수 있다. 초기값은(null)
  const [preview, setPreview] = useState<string | null>(null);   // 미리보기

  // onChange Event : 트윗 상태 변경(저장)
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  }

  // onChange Event : 파일 상태 변경(저장)
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;                   // e.target.files는 FileList 객체, files에 file들이 배열처럼 담겨 있음.
    if (files && files.length === 1) {            // file이 있고, file의 갯수가 1개일 때
      const selectedFile = files[0];              // 첫번째 파일을 선택
      setFile(selectedFile);                      // file를 state에 저장

      const reader = new FileReader();            // FileReader는 브라우저 내장 객체, 비동기적 작동, 파일을 내용을 읽음. 텍스트나 이미지 파일을 base64 형태 등으로 변환.
      reader.onloadend = () => {                  // 파일을 다 읽었을 때 실행되는 콜백 함수
        setPreview(reader.result as string);      // FileReader에 의해 변환된 Base64 문자열을 preview 상태에 저장
      };
      reader.readAsDataURL(selectedFile);         // Base64로 변환해서 reader.result에 담김
    }
  };

  // onSubmit Event
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = auth.currentUser;                    // 현재 로그인된 사용자의 auth(firebase 인증) 객체를 불러옴

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);

      let base64Image = null;
      if (file) {
        base64Image = await compressImage(file);      // ✅ 압축된 이미지 사용
      }

      await addDoc(collection(db, "tweets"), {        // Firestore 콜렉션에 하나의 문서 추가하는 비동기 함수
        tweet,                                        // 트윗 내용
        createdAt: Date.now(),                        // 트윗 생성 시간
        username: user.displayName || "Anonymous",    // 로그인 사용자 이름
        userId: user.uid,                             // 로그인 사용자 UID
        image: base64Image,                           // 이미지 
      });

      setTweet("");                                   // 트윗 초기화
      setFile(null);                                  // 파일 초기화
      setPreview(null);                               // 미리보기 초기화
    } 
    catch (error) {                                   // 에러 처리
      console.error("Upload failed:", error);
    } 
    finally {                                         // 전부 완료시 로딩 완료
      setLoading(false);
    }
  };

  // render
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

      {/* Post Tweet 버튼 */}
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
    </Form>
  );
}
