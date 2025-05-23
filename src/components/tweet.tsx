/* library import */
import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";


/* styled components */
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;


/* Tweet component */
export default function Tweet({ username, image, tweet, userId, id }: ITweet) {    // props
  const user = auth.currentUser;                  // 현재 로그인된 사용자의 정보 불러옴

  // onDelete function
  const onDelete = async () => {
    const ok = confirm("Are you sure?");

    if (!ok || !user || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));     // Firestore의 document를 삭제
    } catch(error) {
      console.log(error);
    } finally {

    }
  }

  // render
  return (
    <Wrapper>

      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId                     // 현재 로그인 사용자(user?.uid)와 트윗 작성자(userId)가 같은 경우
          ? <DeleteButton onClick={onDelete}>Delete</DeleteButton>   // 삭제
          : null}
      </Column>

      <Column>
        {image 
          ? ( <Photo src={`${image}`} /> ) 
          : null}
      </Column>

    </Wrapper>
  )
}
