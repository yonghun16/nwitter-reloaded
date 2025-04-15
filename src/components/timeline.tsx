import { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { getDocs, collection, query, orderBy, onSnapshot, limit, Unsubscribe } from "firebase/firestore";
import Tweet from "./tweet";

// interfaces
export interface ITweet {
  id: string;
  image?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe : Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(        // Firestore Query을 통하여 data 가져오기
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      )

      /*
      const spanshot = await getDocs(tweetsQuery);
  
      const tweets = spanshot.docs.map((doc) => {
        const { tweet, createdAt, username, userId, image } = doc.data();
        return { tweet, createdAt, username, userId, image, id: doc.id };
      });
      */

      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, username, userId, image } = doc.data();
          return { tweet, createdAt, username, userId, image, id: doc.id };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
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
