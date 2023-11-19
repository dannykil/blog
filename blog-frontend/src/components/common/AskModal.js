import React from 'react';
import styled from 'styled-components';
import Button from './Button';

// 화면 전체가 비활성화되는 것처럼 보이고 그 가운데 모달창이 팝업된다
const Fullscreen = styled.div`
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 모달창 프레임 자체(텍스트나 버튼 제외)
const AskModalBlock = styled.div`
  width: 320px;
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  // box-shadow: none | x-position y-position blur(희미한 정도) spread(양수면 확대, 음수면 축소) color
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.125); // rgba : red green blue alpha(투명도) - 0이면 완전투명, 1이면 불투명, 0~1 or 0~100
  h2 {
    // 모달창 제목
    margin-top: 0; // 제목 윗부분 여백
    margin-bottom: 1rem; // 제목 아랫부분 여백
  }
  p {
    // 모달창 내용(제목아래)
    margin-bottom: 3rem; // 모달창 내용 아랫부분 여백
  }
  .buttons {
    // className이 buttons인 모든 태그에 css 적용
    display: flex; // display: flex 속성이 적용된 요소는 flex container가 되고, flex contatiner의 자식 요소는 자동적으로 flex item이 됨
    justify-content: flex-end;
  }
`;

const StyledButton = styled(Button)`
  height: 2rem;
  & + & {
    margin-left: 0.75rem;
  }
`;

const AskModal = ({
  visible,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;
  return (
    <Fullscreen>
      <AskModalBlock>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="buttons">
          <StyledButton onClick={onCancel}>{cancelText}</StyledButton>
          <StyledButton cyan onClick={onConfirm}>
            {confirmText}
          </StyledButton>
        </div>
      </AskModalBlock>
    </Fullscreen>
  );
};

export default AskModal;

// git push test of frontend
