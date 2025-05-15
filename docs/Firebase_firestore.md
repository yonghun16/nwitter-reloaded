# FireStore

### FireStore
- Firebase 플랫폼에서 제공하는 NoSQL 클라우드 데이터베이스 서비스입니다. 정식 명칭은 Cloud Firestore이며, 모바일 및 웹 앱 개발자들이 실시간 데이터를 효율적으로 저장하고 동기화할 수 있게 해줍니다.

#### 주요 특징
1. NoSQL 문서 기반 구조
  - 데이터는 컬렉션(Collection)과 문서(Document) 형태로 저장됩니다.
  - 문서는 JSON과 유사한 필드의 집합이며, 각 문서는 자동 또는 수동으로 지정된 고유 ID를 가집니다.
  - 문서 안에는 서브컬렉션을 포함할 수 있어 중첩된 계층 구조가 가능합니다.
2. 실시간 동기화
  - Firestore는 실시간으로 데이터를 수신 및 전송할 수 있어, 데이터가 변경되면 자동으로 UI가 업데이트됩니다.
  - 모바일 앱이나 웹 앱에서 실시간 협업 기능 구현에 매우 유리합니다.
3. 오프라인 지원
  - 클라이언트 SDK는 오프라인 모드를 지원해 네트워크가 없을 때도 읽기/쓰기 작업을 캐싱하고, 연결이 복구되면 자동으로 동기화합니다.
4. 보안 규칙
  - Firestore 보안 규칙을 통해 인증 상태, 경로, 필드 값 등 다양한 조건에 따라 읽기/쓰기 권한을 설정할 수 있습니다.
5. 확장성
  - Google Cloud 기반으로 자동 확장되며, 대규모 애플리케이션에도 적합합니다.
6. 트랜잭션과 배치 쓰기 지원
  - 여러 문서에 대해 원자성 있는 트랜잭션 처리 가능.
  - 배치 쓰기를 통해 여러 문서에 동시에 변경 사항을 적용할 수 있음.

#### 사용예시
```js
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  // your firebase config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 문서 생성 또는 덮어쓰기
await setDoc(doc(db, "users", "user123"), {
  name: "Alice",
  age: 25
});

// 문서 읽기
const docRef = doc(db, "users", "user123");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  console.log("No such document!");
}
```

## addDoc(), doc(), getDoc(), setDoc(), updateDoc(), deleteDoc()

### addDoc()
- addDoc() 함수는 Firebase의 Cloud Firestore에 새로운 문서(Document) 를 추가하는 함수

#### 사용예시
```js
import { addDoc, collection } from "firebase/firestore";

await addDoc(collection(db, "tweets"), {
  tweet: "Hello World",
  createdAt: Date.now(),
});
```
#### 주요 특징
- 동작 : 지정한 컬렉션에 새로운 문서를 자동으로 생성된 ID와 함께 추가
- 반환값 : 추가된 문서의 참조 (DocumentReference) 객체
- 비동기 처리 : await 키워드를 사용하여 완료될 때까지 기다릴 수 있음
- 자동 문서 ID 생성 : 문서 ID는 Firebase가 랜덤하게 생성하므로 중복 방지 가능
#### 보안 규칙 체크

- Firestore에 데이터를 추가할 때, Firestore의 보안 규칙이 추가 작업을 허용해야 저장됩니다. 
- 아래와 같은 조건이 있어야 로그인한 사용자만 쓸 수 있습니다.
```js
allow write: if request.auth != null;
```

#### 실시간 업데이트 구현
- 나중에 공부



### doc()
- doc() 함수는 Firebase Firestore에서 특정 문서(Document) 를 참조할 때 사용하는 함수입니다. collection()이 컬렉션을 가리키는 반면, doc()은 컬렉션 안의 하나의 문서를 참조
- doc(db, "컬렉션", "문서ID"): 특정 문서를 가리키는 참조를 반환합니다.
- doc()은 Firestore의 문서 위치를 지정할 수 있는 “포인터” 같은 역할을 합니다.
- 이 참조를 통해 getDoc, setDoc, deleteDoc, onSnapshot 등 여러 동작을 수행할 수 있습니다.

#### 기본 사용법
- 아래 코드는 Firestore의 "tweets" 컬렉션에 있는 "abc123" ID를 가진 문서를 참조합니다.
```js
import { doc } from "firebase/firestore";

const tweetRef = doc(db, "tweets", "abc123");
```

#### doc()의 용도
- 문서 읽기 : getDoc(docRef)
- 한 번만 문서를 가져옴 : 문서 쓰기/수정
- setDoc(docRef, data) : 해당 ID로 문서를 생성 또는 덮어씀
- 문서 삭제 : deleteDoc(docRef)
- 해당 문서를 삭제 : 실시간 구독
- onSnapshot(docRef, callback) : 문서 변경을 실시간으로 감지

#### 예제 코드
```js
// 문서 읽기
import { doc, getDoc } from "firebase/firestore";

const docRef = doc(db, "tweets", "abc123");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("데이터:", docSnap.data());
} else {
  console.log("해당 문서가 없습니다.");
}
```
```js
// 문서 쓰기
import { doc, setDoc } from "firebase/firestore";

await setDoc(doc(db, "tweets", "abc123"), {
  tweet: "Hello Firestore",
  username: "John",
});
```
```js
// 문서 삭제
import { deleteDoc, doc } from "firebase/firestore";

await deleteDoc(doc(db, "tweets", "abc123"));
```
```js
// 자동 ID 없이 문서 생성 (ID 수동 지정)
await setDoc(doc(db, "tweets", "myCustomId"), {
  tweet: "이건 내가 ID 정한 트윗",
});
```

#### addDoc()와 doc()의 차이
| 항목       | `addDoc()`                        | `doc()` + `setDoc()`                     |
|------------|-----------------------------------|------------------------------------------|
| 문서 ID    | 자동 생성                         | 직접 지정                                |
| 용도       | 새 문서를 간단히 추가할 때        | 특정 ID에 문서를 저장할 때               |
| 사용 예    | 새 게시물 추가 등                 | 사용자 ID에 맞춰 저장 등                 |
| 중복 방지  | 자동 ID라 중복될 일이 없음        | 같은 ID를 쓰면 덮어쓰기 가능             |

