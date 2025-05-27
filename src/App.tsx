import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import GrammarPage from './pages/GrammarPage';
import SpeakingPage from './pages/SpeakingPage';
import ReadingPage from './pages/ReadingPage';
import ListeningPage from './pages/ListeningPage';
import QuizPage from './pages/QuizPage';
import EvaluationPage from './pages/EvaluationPage';
import ConfirmPageA1_2 from './pages/ConfirmPageA1-2';
import ConfirmPageA1_3 from './pages/ConfirmPageA1-3';
import WritingPage from './pages/WritingPage';
import EFLCurriculumCarousel from './pages/EFLCurriculumCarousel';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/speaking" element={<SpeakingPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/listening" element={<ListeningPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/evaluation" element={<EvaluationPage />} />
          <Route path="/confirm-a1-2" element={<ConfirmPageA1_2 />} />
          <Route path="/confirm-a1-3" element={<ConfirmPageA1_3 />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/curriculum" element={<EFLCurriculumCarousel />} />
        </Routes>
      </Layout>
    </AnimatePresence>
  );
}

export default App;