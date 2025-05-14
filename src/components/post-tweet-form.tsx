/* library import */
import styled from "styled-components"
import { useState } from "react"
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

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
    const { files } = e.target;              // e.target.files는 FileList 객체, files에 file들이 배열처럼 담겨 있음.
    if (files && files.length === 1) {       // file이 있고, file의 갯수가 1개일 때
      const selectedFile = files[0];         // 첫번째 파일을 선택
      setFile(selectedFile);                 // file를 state에 저장

      const reader = new FileReader();       // FileReader는 브라우저 내장 객체, 비동기적 작동, 파일을 내용을 읽음. 텍스트나 이미지 파일을 base64 형태 등으로 변환.
      reader.onloadend = () => {             // 파일을 다 읽었을 때 실행되는 콜백 함수
        setPreview(reader.result as string); // FileReader에 의해 변환된 Base64 문자열을 preview 상태에 저장
      };
      reader.readAsDataURL(selectedFile);    // Base64로 변환해서 reader.result에 담김
    }
  };

  // 이미지 600KB 이하로 압축
  const compressImage = (file: File, maxSizeInKB = 600): Promise<string> => {  // 이미지 file을 입력받아 base64 문자열(string)을 반환. 
                                                                               // 반환 타입이 Promise<string>인 이유는 파일 읽기, 이미지 로딩, canvas 처리 등이 모두 비동기 작업이기 때문
    return new Promise((resolve, reject) => {
      const reader = new FileReader();                                         // 브라우져 내장 객체 FileReader 생성 -> Base64로 변환

      reader.onload = (event) => {                                             // 파일이 다 읽혔으면
        const img = new Image();                                               // 이미지 객체 생성
        img.src = event.target?.result as string;                              // Base64 문자열로 변환된 파일을 이미지 객체에 로딩

        img.onload = () => {                                                   // 이미지 로딩 완료시 (img.width, img.height 등의 정보 얻을 수 있음.)
          const canvas = document.createElement("canvas");                     // canvas 객체 생성
          const MAX_WIDTH = 800;                                               // 이미지 크기 제한
          const scaleSize = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;                                            // 이미지 크기 조정
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");                                 // canvas에서 2D 렌더링 컨텍스트를 가져온다.
          if (!ctx) return reject("Canvas context not available");             // 없으면 실패 처리

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);               // canvas에 이미지 그리기
                                                                               // 이 시점에서 크기 변경이 반영된 이미지가 캔버스에 올라감
          let quality = 0.9;                                                   // quality는 0~1 사이의 압축 품질
          let base64 = canvas.toDataURL("image/jpeg", quality);                // canvas.toDataURL()을 사용해 캔버스 내용을 JPEG 포맷의 0.9의 quailty로 Base64으로 추출

          // 반복적으로 압축하여 600KB 이하 만들기
          while (base64.length > maxSizeInKB * 1024 && quality > 0.1) {
            quality -= 0.05;
            base64 = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(base64);                                                      // 최종적으로 용량이 줄어든 Base64 문자열을 반환
        };

        img.onerror = reject;                                                   // 에러처리
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);                                               // Base64로 변환해서 reader.result에 담김

    });
  };

  // onSubmit Event
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);

      let base64Image = null;
      if (file) {
        base64Image = await compressImage(file);      // ✅ 압축된 이미지 사용
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
      setPreview(null);                               // ✅ 미리보기 초기화
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
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
