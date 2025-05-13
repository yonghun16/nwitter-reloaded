# styled-reset

```bash
npm install styled-reset
```


### styled-reset
- styled-reset은 styled-components와 함께 사용되는 CSS 리셋(reset) 유틸리티


### 사용 예시
```tsx
// App.tsx 또는 GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}                                // styled-reset 리셋 적용
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;
```

```tsx
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GlobalStyle from './GlobalStyle';

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root')
);
```
