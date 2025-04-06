import { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
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

`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const fetchTweets = async () => {
    const tweetsQuery = query(        // Firestore Query을 통하여 data 가져오기
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    )

    const spanshot = await getDocs(tweetsQuery);

    const tweets = spanshot.docs.map((doc) => {
      const { tweet, createdAt, username, userId, image } = doc.data();
      return { tweet, createdAt, username, userId, image, id: doc.id };
    });

    // tweets state update
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map(tweet => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
