# 라우팅


### BrowserRouter VS createBrowserRouter
- BrowserRouter
  - 사용 방식 : JSX, 
  - 주요 용도 : 기본 라우팅 
  - API 스타일 : Routes / Route 컴포넌트
  - 버젼 : React Router v6 전체
  - 복잡도 : 간단
- createBrowserRouter
  - 사용 방식 : createBrowserRouter
  - 주요 용도 : 데이터 로딩, 폼 액션 등 고급 기능
  - API 스타일 : RouterProvider 사용
  - 버젼 :  React Router V6.4 이상 필수
  - 복잡도 : 복잡한 앱에 적합

```JSX
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    loader: homeLoader,
    children: [
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```
#### loader
- loader는 컴포넌트가 렌더링되기 전에 데이터를 미리 가져오는 함수
  - SSR (서버사이드 렌더링)이나 Next.js의 getServerSideProps와 비슷한 역할
  - 컴포넌트가 뜨기 전에 필요한 데이터를 비동기적으로 로딩함
  - 라우터 트리에 선언함
```jsx
// loader 함수
const homeLoader = async () => {
  const res = await fetch('/api/home');
  return res.json();
};

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    loader: homeLoader,
  },
]);

// 컴포넌트에서 loader 데이터 사용
import { useLoaderData } from 'react-router-dom';

function Home() {
  const data = useLoaderData();
  return <div>{data.title}</div>;
}
```
#### children
- children은 라우팅에서 **중첩 라우트 (nested routes)**를 정의할 때 사용하는 키입니다.
```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },         // / 경로
      { path: 'about', element: <About /> },   // /about 경로
    ],
  },
]);

function Layout() {
  return (
    <div>
      <h1>공통 레이아웃</h1>
      <Outlet />  {/* 여기에 children이 렌더링됨 */}
    </div>
  );
}
```
- Layout이 공통 부모 컴포넌트 역할을 하고
- 그 아래 children 라우트들이 <Outlet /> 자리에 렌더링.
