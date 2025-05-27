import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

const quizMap = {
  'vo_01-01': lazy(() => import('../store/u1/Vocabulary/vo_01-01')), // Flashcard
  'vo_01-02': lazy(() => import('../store/u1/Vocabulary/vo_01-02')), // Quiz
  'gr_01-01': lazy(() => import('../store/u1/Grammar/gr_01-01')), // Verb To Be Quiz
  'gr_01-02': lazy(() => import('../store/u1/Grammar/gr_01-02')), // Present Simple Flashcards
  'gr_01-03': lazy(() => import('../store/u1/Grammar/gr_01-03')), // New Yes/No Quiz
  'gr_01-04': lazy(() => import('../store/u1/Grammar/gr_01-04')), // New Flashcards Activity
  're_01-01': lazy(() => import('../store/u1/Reading/re_01-01')), // Beginner All About You Quiz
  'sp_01-01': lazy(() => import('../store/u1/Speaking/sp_01-01')), // Introductions Flashcard Quiz
  'li_01-01': lazy(() => import('../store/u1/Listening/li_01-01')), // Short Conversations Quiz
  'vo_01-03': lazy(() => import('../store/u1/Vocabulary/vo_01-03')), // Everyday Objects Flashcards
  're_01-02': lazy(() => import('../store/u1/Reading/re_01-02')), // Anna’s Daily Life Quiz
  'wr_01-01': lazy(() => import('../store/u1/Writing/wr_01-01')), // Sentence Reordering Quiz
  'vo_01-04': lazy(() => import('../store/u1/Vocabulary/vo_01-04')), // Classroom Objects Flashcards
} as const;

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const QuizComponent = quizId && quizMap[quizId];

  if (!QuizComponent) {
    return <div className="text-center p-4">Quiz not found!</div>;
  }

  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <QuizComponent />
    </Suspense>
  );
};

export default QuizPage;
