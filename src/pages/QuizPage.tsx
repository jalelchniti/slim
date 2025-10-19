import React, { lazy, Suspense, FC } from 'react';
import { useParams } from 'react-router-dom';

const quizMap = {
  'vo_01-01': lazy(() => import('../store/u1/Vocabulary/vo_01-01')),
  'vo_01-02': lazy(() => import('../store/u1/Vocabulary/vo_01-02')),
  'gr_01-01': lazy(() => import('../store/u1/Grammar/gr_01-01')),
  'gr_01-02': lazy(() => import('../store/u1/Grammar/gr_01-02')),
  'gr_01-03': lazy(() => import('../store/u1/Grammar/gr_01-03')),
  'gr_01-04': lazy(() => import('../store/u1/Grammar/gr_01-04')),
  're_01-01': lazy(() => import('../store/u1/Reading/re_01-01')),
  'sp_01-01': lazy(() => import('../store/u1/Speaking/sp_01-01')),
  'li_01-01': lazy(() => import('../store/u1/Listening/li_01-01')),
  'vo_01-03': lazy(() => import('../store/u1/Vocabulary/vo_01-03')),
  're_01-02': lazy(() => import('../store/u1/Reading/re_01-02')),
  'vo_01-04': lazy(() => import('../store/u1/Vocabulary/vo_01-04')),
} as const;

type QuizId = keyof typeof quizMap;

const QuizPage: FC = () => {
  const { quizId } = useParams<{ quizId: QuizId }>();

  if (!quizId || !(quizId in quizMap)) {
    return <div className="text-center p-4">Quiz not found!</div>;
  }

  const QuizComponent = quizMap[quizId];

  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <QuizComponent />
    </Suspense>
  );
};

export default QuizPage;
