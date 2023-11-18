import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost, writePost } from '../../modules/write';
import {
  useLocation,
  useNavigate,
} from '../../../node_modules/react-router-dom/dist/index';
import WriteActionButtons from 'components/write/WriteActionButtons';

const WriteActionButtonsContainer = ({ history }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { title, body, tags, post, postError, originalPostId } = useSelector(
    ({ write }) => ({
      title: write.title,
      body: write.body,
      tags: write.tags,
      post: write.post,
      postError: write.postError,
      originalPostId: write.originalPostId,
    }),
  );

  const onPublish = () => {
    if (originalPostId) {
      dispatch(updatePost({ title, body, tags, id: originalPostId }));
      return;
    }
    dispatch(
      writePost({
        title,
        body,
        tags,
      }),
    );
  };

  const onCancle = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log('post : ' + post);
    if (post) {
      const { _id, user } = post;
      console.log(_id);
      console.log(user);
      navigate(`/@${user.username}/${_id}`);
      // navigate(`${location.pathname}/${user.username}/${_id}`);
      // navigate(-1);
    }
    if (postError) {
      console.log(postError);
    }
  }, [history, post, postError]);
  return (
    <WriteActionButtons
      onPublish={onPublish}
      onCancle={onCancle}
      isEdit={!!originalPostId}
    />
  );
};

export default WriteActionButtonsContainer;
