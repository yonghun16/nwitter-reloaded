# FileReader

### FileReader란?
- FileReader는 웹 브라우저에서 제공하는 내장 객체로, 사용자가 업로드한 파일을 읽어들일 수 있게 해주는 API. 
- 이미지 미리보기, 텍스트 파일 읽기, 파일 크기 확인 등 다양한 상황에서 사용
  - 정의 : 클라이언트 측 파일을 비동기적으로 읽기 위해 사용하는 객체
  - 주 용도: 사용자가 \<input type="file">로 선택한 파일을 자바스크립트로 읽는 것

### 기본 사용 흐름
```ts
const reader = new FileReader();

reader.onload = (event) => {
  const result = event.target?.result;
  console.log(result);      // 파일 내용을 읽은 결과 (예: Base64 문자열)
};

reader.readAsDataURL(file); // 또는 readAsText, readAsArrayBuffer 등
```

```ts
// 예제: 이미지 파일 Base64로 읽기
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    console.log("Base64 결과:", reader.result);
  };

  reader.onerror = () => {
    console.error("파일을 읽는 중 에러 발생:", reader.error);
  };

  reader.readAsDataURL(file); // Base64로 변환해서 reader.result에 담김
};
```

### 주요 메서드
- readAsText(file)
  - 파일을 텍스트로 읽습니다. 예: .txt, .json 등
- readAsDataURL(file)
  - 파일을 Base64 인코딩된 데이터 URI로 읽습니다. 예: 이미지 미리보기
- readAsArrayBuffer(file)
  - 파일을 이진 데이터 (ArrayBuffer)로 읽습니다. 예: 바이너리 파일 처리
- abort()
  - 파일 읽기를 중단합니다.

### 실제 동작 순서
  1. new FileReader() → FileReader 객체 생성
  2. readAsDataURL(file) → 파일 읽기 및 Base64로 변환 시작
  3. 내부적으로 Base64로 인코딩 완료
  4. reader.result에 Base64 결과 문자열 저장
  5. onload 또는 onloadend 콜백 호출됨

### 주요 이벤트
- onload
  - 파일 읽기에 성공했을 때 실행
- onloadend
  - 성공/실패와 관계없이 읽기 작업이 끝났을 때 실행
- onerror
  - 파일 읽기에 실패했을 때 실행
- onprogress
  - 파일을 읽는 중에 주기적으로 호출됨 (업로드 진행률 UI에 활용 가능)
- onabort
  -읽기가 중단됐을 때 실행

### 주의 사항
- 주의사항
  - FileReader는 브라우저에서만 동작합니다 (Node.js에서는 사용 불가).
  - 비동기 함수이기 때문에 reader.onload, reader.onloadend 같은 콜백이 필요합니다.
  - 파일이 너무 크면 성능에 영향을 줄 수 있으므로 주의해야 합니다.
