import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import styled from "styled-components";

const SearchContainer = styled.div`
  background: #16181c;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
`;
const SearchInput = styled.input`
  width: 100%;
  border-radius: 20px;
  border: 1px solid #222;
  background: #111;
  color: #fff;
  padding: 12px 16px;
  font-size: 15px;
  margin-bottom: 12px;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const SearchResults = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;
const ResultItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #222;
  cursor: pointer;
  &:hover {
    background: rgba(29,155,240,0.1);
  }
`;
const ResultAuthor = styled.div`
  font-weight: 600;
  color: #1d9bf0;
  font-size: 14px;
  margin-bottom: 4px;
`;
const ResultText = styled.div`
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
`;
const ResultCount = styled.div`
  color: #aaa;
  font-size: 12px;
  margin-bottom: 8px;
`;

interface SearchResult {
  id: string;
  tweet: string;
  username: string;
  createdAt: number;
}

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const q = query(
      collection(db, "tweets"),
      where("tweet", ">=", searchTerm),
      where("tweet", "<=", searchTerm + "\uf8ff"),
      orderBy("tweet"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const searchResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SearchResult[];
      setResults(searchResults);
      setIsSearching(false);
    }, (error) => {
      console.log("Search error:", error);
      setIsSearching(false);
    });

    return () => unsub();
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    // 검색 결과 클릭 시 해당 트윗으로 스크롤하거나 하이라이트
    console.log("Clicked result:", result);
    // TODO: 트윗으로 스크롤 기능 추가
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="트윗 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm.trim().length >= 2 && (
        <>
          <ResultCount>
            {isSearching ? "검색 중..." : `${results.length}개 결과`}
          </ResultCount>
          <SearchResults>
            {results.map((result) => (
              <ResultItem key={result.id} onClick={() => handleResultClick(result)}>
                <ResultAuthor>{result.username}</ResultAuthor>
                <ResultText>{result.tweet}</ResultText>
              </ResultItem>
            ))}
          </SearchResults>
        </>
      )}
    </SearchContainer>
  );
} 