import Responsive from 'components/common/Responsive';
import HeaderContainer from 'containers/common/HeaderContainer';
import EditorContainer from 'containers/write/EditorContainer';
import TagBoxContainer from 'containers/write/TagBoxContainer';
import WriteActionButtonsContainer from 'containers/write/WriteActionButtonsContainer';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const WritePage = () => {
  return (
    // <Responsive>
    //   <EditorContainer />
    //   <TagBoxContainer />
    //   <WriteActionButtonsContainer />
    // </Responsive>
    <>
      <Helmet>
        <title>글 작성하기 - REACTERS</title>
      </Helmet>
      <HeaderContainer />
      <EditorContainer />
      <TagBoxContainer />
      <WriteActionButtonsContainer />
    </>
  );
};

export default WritePage;
