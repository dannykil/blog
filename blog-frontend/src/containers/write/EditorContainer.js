import Editor from 'components/write/Editor';
import { changeField } from 'modules/write';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const EditorContainer = () => {
  const dispatch = useDispatch();
  const { title, body } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
  }));
  const onChangeField = useCallback(
    (payload) => dispatch(changeField(payload)),
    [dispatch],
  );
  return <Editor onChangeField={onChangeField} title={title} body={body} />;
};

export default EditorContainer;
