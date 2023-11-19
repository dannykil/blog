import React from 'react';
import styled from 'styled-components';
import { Link } from '../../../node_modules/react-router-dom/dist/index';
import palette from '../../lib/styles/palette';

// 화면 전체가 비활성화되는 것처럼 보이고 그 가운데 모달창이 팝업된다
const AuthTemplateBlock = styled.div`
  position: absolute; // 부모 요소를 기준으로 배치
  left: 0; // 해당 지점부터 시작
  top: 0;
  bottom: 0;
  right: 0;
  background: ${palette.gray[2]};
  display: flex;
  flex-direction: column; // flexitem 세로정렬
  justify-content: center; // 가운데를 기준으로 세로정렬
  align-items: center;
`;

const WhiteBox = styled.div`
  .logo-area {
    display: block; // 한줄 모두 차지
    padding-bottom: 2rem; // 제목 아랫부분의 여백
    text-align: center;
    font-weight: bold;
    letter-spacing: 2px; // 글자간 간격
  }
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 360px;
  background: white;
  border-radius: 2px;
`;

// 로그인, 회원가입를 위한 컴포넌트
// children : 선언한 컴포넌트(부모)) 내 포함된 컴포넌트(자식)들의 값을 조회하고 싶을 때 사용한다.
// 반대의 개념이 props. 부모 컴포넌트의 값을 자식 컴포넌트가 조회하고자 할 때 사용한다.
const AuthTemplate = ({ children }) => {
  return (
    <AuthTemplateBlock>
      <WhiteBox>
        <div className="logo-area">
          <Link to="/">REACTORS</Link>
        </div>
        {children}
      </WhiteBox>
    </AuthTemplateBlock>
  );
};

export default AuthTemplate;
