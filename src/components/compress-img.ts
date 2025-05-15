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

        while (base64.length > maxSizeInKB * 1024 && quality > 0.1) {        // 반복적으로 압축하여 600KB 이하 만들기
          quality -= 0.05;
          base64 = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(base64);                                                     // 최종적으로 용량이 줄어든 Base64 문자열을 반환
      };

      img.onerror = reject;                                                  // 에러처리
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);                                              // Base64로 변환해서 reader.result에 담김

  });
};

export default compressImage;
