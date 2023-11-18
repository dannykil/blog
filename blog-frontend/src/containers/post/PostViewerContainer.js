import PostActionButtons from 'components/posts/PostActionButtons';
import PostViewer from 'components/posts/PostViewer';
import { removePost } from 'lib/api/posts';
import { readPost, unloadPost } from 'modules/post';
import { setOriginalPost } from 'modules/write';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigate,
  useParams,
} from '../../../node_modules/react-router-dom/dist/index';

// const PostViewerContainer = ({ match }) => {
const PostViewerContainer = () => {
  //   const { postId } = match.params;
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, error, loading, user } = useSelector(
    ({ post, loading, user }) => ({
      post: post.post,
      error: post.error,
      loading: loading['post/READ_POST'],
      user: user.user,
    }),
  );

  useEffect(() => {
    dispatch(readPost(postId));
    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    navigate('/write');
  };

  const onRemove = async () => {
    console.log('123');
    try {
      await removePost(postId);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  const ownPost = (user && user._id) === (post && post.user._id);

  return (
    <PostViewer
      post={post}
      loading={loading}
      error={error}
      actionButtons={
        ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
      }
    />
  );
};

export default PostViewerContainer;
