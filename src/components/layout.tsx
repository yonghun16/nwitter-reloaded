/* library import */
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { auth } from "../firebase"
import SearchBox from "./search-box";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(350px, 600px) 1fr;
  height: 100vh;
  width: 100vw;
  background: #000;
  font-family: 'Segoe UI', 'Apple SD Gothic Neo', 'Roboto', 'sans-serif';
  column-gap: 40px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr minmax(350px, 600px);
    column-gap: 24px;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    column-gap: 0;
  }
`;

const Sidebar = styled.aside`
  padding: 32px 0 0 0;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media (max-width: 900px) {
    display: none;
  }
`;
const SidebarLogo = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 40px;
    height: 40px;
    fill: #fff;
  }
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;
const MenuItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})<{active?: boolean}>`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 10px 24px 10px 12px;
  border-radius: 32px;
  font-size: 18px;
  font-weight: 500;
  color: ${({active}) => active ? '#1d9bf0' : '#fff'};
  background: ${({active}) => active ? 'rgba(29,155,240,0.1)' : 'transparent'};
  transition: background 0.15s, color 0.15s;
  svg {
    width: 28px;
    height: 28px;
    fill: ${({active}) => active ? '#1d9bf0' : '#fff'};
    transition: fill 0.15s;
  }
  &:hover {
    background: rgba(29,155,240,0.15);
    color: #1d9bf0;
    svg { fill: #1d9bf0; }
  }
  &.log-out {
    color: #e74c3c;
    svg { fill: #e74c3c; }
    &:hover {
      background: rgba(231,76,60,0.12);
      color: #fff;
      svg { fill: #fff; }
    }
  }
`;
const SidebarBottom = styled.div`
  margin-top: auto;
  padding-bottom: 32px;
`;

const SidebarRightBox = styled.aside`
  padding: 32px 0 0 0;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 900px) {
    display: none;
  }
`;
const TrendBox = styled.div`
  background: #16181c;
  color: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  margin-top: 32px;
  min-width: 220px;
  max-width: 300px;
  font-size: 15px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.12);
`;

const Center = styled.main`
  background: #000;
  min-height: 100vh;
  border-left: 1px solid #222;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-top: 36px;
  padding-bottom: 36px;
  padding-left: 24px;
  padding-right: 24px;
  @media (max-width: 900px) {
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 24px;
    padding-bottom: 24px;
  }
  @media (max-width: 700px) {
    border: none;
    padding: 16px 0 16px 0;
  }
`;

function SidebarLeft({ onLogOut }: { onLogOut: () => void }) {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarLogo>
        {/* X 로고 SVG */}
        <svg viewBox="0 0 32 32"><g><path d="M17.14 14.88l7.14-8.88h-1.67l-6.19 7.7-4.95-7.7h-6.13l7.38 11.48-7.38 9.12h1.67l6.43-7.95 5.11 7.95h6.13l-7.54-11.02zm-2.27 2.74l-0.75-1.17-6.01-9.33h3.36l4.81 7.48 0.75 1.17 6.19 9.33h-3.36l-4.99-7.48z"></path></g></svg>
      </SidebarLogo>
      <Menu>
        <Link to="/" style={{textDecoration:'none'}}>
          <MenuItem active={location.pathname === "/"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z" /></svg>
            홈
          </MenuItem>
        </Link>
        <Link to="/profile" style={{textDecoration:'none'}}>
          <MenuItem active={location.pathname.startsWith("/profile")}> 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
            프로필
          </MenuItem>
        </Link>
      </Menu>
      <SidebarBottom>
        <MenuItem className="log-out" onClick={onLogOut}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /> </svg>
          로그아웃
        </MenuItem>
      </SidebarBottom>
    </Sidebar>
  );
}

function SidebarRight() {
  return (
    <SidebarRightBox>
      <SearchBox />
      <TrendBox>
        <b style={{fontSize:'17px'}}>트렌드</b>
        <ul style={{margin:'16px 0 0 0', padding:0, listStyle:'none', color:'#aaa', fontSize:'14px'}}>
          <li>#React</li>
          <li>#Firebase</li>
          <li>#AI</li>
          <li>#CloneCoding</li>
        </ul>
      </TrendBox>
      <TrendBox>
        <b style={{fontSize:'17px'}}>추천</b>
        <div style={{marginTop:12, color:'#aaa', fontSize:'14px'}}>더 많은 기능은 곧 추가됩니다!</div>
      </TrendBox>
    </SidebarRightBox>
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const onLogOut = async () => {
    const ok = confirm("Are you sure?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <Wrapper>
      <SidebarLeft onLogOut={onLogOut} />
      <Center>
        <Outlet />
      </Center>
      <SidebarRight />
    </Wrapper>
  );
}
