import { auth } from "../firebase";
import { useState } from "react";
import styled from "styled-components";

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
  //width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL ?? undefined);
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target;
    if (files && files.length === 1 && files[0].size > 0) {
      const file = files[0];
    }
  }
  return <Wrapper>
    <AvatarUpload>
      {Boolean(avatar)
        ? <AvatarImg src={avatar} />
        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      }
      <AvatarImg />
    </AvatarUpload>
    <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
    <Name> {user?.displayName ?? "Anonymous"} </Name>
  </Wrapper>;
}
