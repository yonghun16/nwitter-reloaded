# Firestore Query
- Firestore는 **컬렉션(collection)**과 도큐먼트(document) 단위로 데이터를 저장하며, 다양한 조건으로 데이터를 조회(query)할 수 있는 기능을 제공
- 참고문서 : https://firebase.google.com/docs/firestore/query-data/queries?hl=ko



### 기본 구조
- Firestore에서 쿼리는 컬렉션을 기준으로 수행합니다.
  - 예: db.collection('users').where(...)


### 자주 쓰이는 쿼리 

#### 1. 단순 조건 쿼리
```js
db.collection("users")
  .where("age", "==", 20)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  });
```

#### 2. 비교 연산자
- ==, !=
- <, <=, >, >=
- array-contains, array-contains-any
- in, not-in
```js
db.collection("users")
  .where("age", ">=", 18)
  .where("age", "<=", 30)
  .get();
```

#### 3. 정렬 (orderBy)
- orderBy()를 사용할 때는 where과 함께 사용할 경우 인덱스 설정이 필요할 수 있습니다.
```js
db.collection("users")
  .orderBy("age", "desc")
  .get();
```

### 복합 쿼리
- Firestore에서는 같은 필드에 대해 where과 orderBy를 함께 사용할 수 있습니다. 
- 단, 복합 인덱스가 필요할 수 있습니다. Firebase 콘솔에서 자동으로 생성하라는 링크가 제공됩니다.
```js
db.collection("products")
  .where("category", "==", "vegetable")
  .where("price", "<", 1000)
  .orderBy("price", "asc")
  .get();
```

### 페이징 처리
```js
let first = db.collection("users")
              .orderBy("age")
              .limit(10);

first.get().then((documentSnapshots) => {
  // 다음 페이지를 위한 마지막 문서
  let lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

  // 다음 쿼리
  db.collection("users")
    .orderBy("age")
    .startAfter(lastVisible)
    .limit(10)
    .get();
});
```

## onSnapshot, Unsubscribe

### onSnapshot
- onSnapshot()은 Firebase Firestore의 실시간 업데이트 기능을 사용할 때 쓰는 메서드입니다.
- 이 함수는 지정한 문서나 컬렉션의 데이터를 실시간으로 감지하고, 변경이 생기면 자동으로 콜백 함수를 실행해줍니다.

#### 기본 개념
- users 컬렉션에 변경(추가, 수정, 삭제)이 발생하면,
- 자동으로 콜백 함수가 호출되어 새로운 데이터를 전달합니다.
```js
import { onSnapshot, collection } from "firebase/firestore";

const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
});
```
