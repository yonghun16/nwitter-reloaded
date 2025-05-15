/* library import */
import { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
// firestore Query 함수 import
import { collection, query, orderBy, onSnapshot, limit, Unsubscribe } from "firebase/firestore";
import Tweet from "./tweet";


/* styled components */
const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;


/* interfaces */
export interface ITweet {
  id: string;
  image?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}


/* Timeline component */
export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe : Unsubscribe | null = null;    // Firestore의 onSnapshot 리스너를 해제하기 위한 unsubscribe 함수를 저장할 변수

    // Firestore의 “tweets” 컬렉션에서 데이터를 가져오기 위한 쿼리
    const fetchTweets = async () => {
      const tweetsQuery = query(                    
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),               // orderBy("createdAt", "desc"): createdAt 기준으로 내림차순 정렬 (최신 트윗 먼저).
        limit(25)
      )

      /* firebase에서 데이터를 '한 번'만 '가져오는' 코드
      const snapshot = await getDocs(tweetsQuery);
       
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, username, userId, image } = doc.data();
        return { tweet, createdAt, username, userId, image, id: doc.id };
      });
      */

      // firebase에서 데이터를 '실시간'으로 '가져오는' 코드
      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {                     // tweetsQuery 조건에 맞는 데이터를 가져오고, 해당 데이터에 변경이 생기면 자동으로 다시 실행
        const tweets = snapshot.docs.map((doc) => {                             // snapshot.docs 배열을 순회하며 각 문서를 tweet 객체로 매핑
          const  { tweet, createdAt, username, userId, image } = doc.data();
          return { tweet, createdAt, username, userId, image, id: doc.id };     // doc 객체 반환
        });
        setTweets(tweets);
      });
    };

    fetchTweets();

    // cleanup
    return () => {
      unsubscribe && unsubscribe();        // unsubscribe가 null, undefined가 아닐 때만 unsubscribe()를 실행하여 구독 취소
    }
  }, []);

  return (
    <Wrapper>
      {tweets.map(tweet => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
