/* library import */
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, Unsubscribe, onSnapshot, limit, orderBy, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import styled from "styled-components";
import compressImage from "../components/compress-img";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";


/* styled components */
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;


/* Profile component */
export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL ?? undefined);
  const [tweets, setTweets] = useState<ITweet[]>([]);


  useEffect(() => {
    const fetchProfileAvatar = async () => {
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.avatarBase64) {
          setAvatar(data.avatarBase64);  // img src로 직접 사용 가능
        }
      }
    };

    fetchProfileAvatar();
    fetchTweets();
  }, []);

  // onAvatarChange Event
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1 && files[0].size > 0) {
      let base64Image = null;
      const file = files[0];

      base64Image = await compressImage(file);      // ✅ 압축된 이미지 사용

      setAvatar(base64Image);

      await setDoc(doc(db, "users", user.uid), {    // 
        avatarBase64: base64Image                   // avatarBase64 필드에 압축된 base64 문자열을 저장
      }, { merge: true });                          // 기존 문서 병합
    }
  }

  // 내 트윗 가져오기
  const fetchTweets = async () => {
    let unsubscribe: Unsubscribe | null = null;    // Firestore의 onSnapshot 리스너를 해제하기 위한 unsubscribe 함수를 저장할 변수

    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );

    unsubscribe = onSnapshot(tweetQuery, (snapshot) => {                     // tweetsQuery 조건에 맞는 데이터를 가져오고, 해당 데이터에 변경이 생기면 자동으로 다시 실행
      const tweets = snapshot.docs.map((doc) => {                             // snapshot.docs 배열을 순회하며 각 문서를 tweet 객체로 매핑
        const { tweet, createdAt, username, userId, image } = doc.data();
        return { tweet, createdAt, username, userId, image, id: doc.id };     // doc 객체 반환
      });
      setTweets(tweets);
    });

    return () => {
      unsubscribe && unsubscribe();        // unsubscribe가 null, undefined가 아닐 때만 unsubscribe()를 실행하여 구독 취소
    }
  };

  // render
  return (
    <Wrapper>

      <AvatarUpload htmlFor="avatar">
        {Boolean(avatar)
          ? <AvatarImg src={avatar} />
          : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        }
      </AvatarUpload>

      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />

      <Name>
        {user?.displayName ?? "Anonymous"}
      </Name>

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>

    </Wrapper>
  );
}
