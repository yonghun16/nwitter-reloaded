/* canvas.toDataURL() :  캔버스에 그려진 내용을 이미지로 “인코딩”해서 문자열(base64 포맷 포함)로 반환하는 함수.
 *
 */

import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
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
  resize: none;
  box-sizing: border-box;
  font-family: system-ui;
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

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
`;

const DrawingCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
  cursor: crosshair;
  /* width/height 제거 - 실 해상도는 useEffect에서 설정 */
`;

const ClearButton = styled.button`
  background-color: #ff4757;
  color: white;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  &:hover {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  // 파일 업로드가 된다면
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const selectedFile = files[0];
      setFile(selectedFile);

      const reader = new FileReader();          // FileReader는 '비동기적'으로 동작함.
      reader.readAsDataURL(selectedFile);       // 선택된 파일을 base64로 읽어 reader.result에 반환함. 
      // onload : 파일 읽기에 성공했을 때 자동 호출됨.  onerror : 파일 읽기에 실패했을 때 실행됨.  onloadend : 성공 여부와 관계없이 읽기 작업이 끝났을 때 실행됨.
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const resize = () => {
      const width = img.clientWidth;
      const height = img.clientHeight;

      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [preview]);

  /* ---------  Canvas methods ---------- */
  const getCanvasCoords = (
    e: MouseEvent | TouchEvent,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  };

  const startDrawing = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCanvasCoords(e.nativeEvent as MouseEvent | TouchEvent, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCanvasCoords(e.nativeEvent as MouseEvent | TouchEvent, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };
  /* ----------------------------------------------- */

  // canvas를 초기화
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // canvas와 이미지를 합치고 base64 문자열로 변환
  const mergeImageAndCanvas = (): Promise<string | null> => {
    const canvasLayer = canvasRef.current;
    if (!preview || !canvasLayer) return Promise.resolve(null);

    const displayWidth = canvasLayer.width;
    const displayHeight = canvasLayer.height;

    return new Promise((resolve) => {
      const img = new Image();
      img.src = preview;
      img.onload = () => {
        const mergedCanvas = document.createElement("canvas");
        mergedCanvas.width = displayWidth;
        mergedCanvas.height = displayHeight;

        const ctx = mergedCanvas.getContext("2d");
        if (!ctx) return resolve(null);

        // 이미지도 렌더링된 사이즈 기준으로 그리기
        ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
        ctx.drawImage(canvasLayer, 0, 0);  // 동일 사이즈니까 그대로 올리기

        const merged = mergedCanvas.toDataURL("image/jpeg", 0.9);
        resolve(merged);
      };
      img.onerror = () => resolve(null);
    });
  };

  // 트윗 전송(Submit)
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 유효성 검사
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;  // 로그인 유저가 없거나, 현재 로딩중이거나, 트윗 내용이 비어있거나, 트윗이 180자를 초과하면 리턴

    try {
      setLoading(true);

      // 이미지 압축
      let base64Image = null;
      if (file && preview) {  // 파일과 preview가 있을 때
        base64Image = await mergeImageAndCanvas(); // mergeImageAndCanvas() 함수로 이미지를 처리하여 base64 문자열로 전환
      }

      // 데이터 콜렉션에 추가
      await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        image: base64Image,
      });

      // 전송 후 화면 초기화
      setTweet("");
      setFile(null);
      setPreview(null);
      clearCanvas();
    } catch (error) {
      console.log(error);
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
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        type="file"
        onChange={onFileChange}
        id="file"
        accept="image/*"
      />
      {preview && (
        <>
          <CanvasWrapper>
            <ImagePreview ref={imageRef} src={preview} alt="Preview" />
            <DrawingCanvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </CanvasWrapper>
          <ClearButton type="button" onClick={clearCanvas}>
            Clear Drawing
          </ClearButton>
        </>
      )}
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
    </Form>
  );
}
