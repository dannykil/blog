import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Routes } from '../node_modules/react-router-dom/dist/index';
import LoginPage from './pages/LoginPage';
import PostListPage from './pages/PostListPage';
import PostPage from './pages/PostPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';

const App = () => {
  return (
    <>
      <Helmet>
        <title>REACTERS</title>
      </Helmet>
      <Routes>
        {/* <Route path={['/@:username', '/']} element={<PostListPage />} /> */}
        {/* <Route path="/@:username" element={<PostListPage />} /> */}
        <Route path="/" element={<PostListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/:username">
          <Route index element={<PostListPage />} />
          <Route path=":postId" element={<PostPage />} />
        </Route>
        {/* <Route path="/@:username/:postId" element={<PostPage />} /> */}
        {/* <Route path="/:username/:postId" element={<PostPage />} /> */}
      </Routes>
    </>
  );
};

export default App;
