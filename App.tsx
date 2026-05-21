import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Splash }          from './components/Splash';
import { Navbar }          from './components/Navbar';
import Home                from './Home';
import CalculatorPage      from './CalculatorPage';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] origin-left"
      style={{
        scaleX,
        height: 2,
        background: 'linear-gradient(90deg, #00A86B, #00D68F, #00E5B8)',
        boxShadow: '0 0 8px rgba(0,214,143,0.5)',
      }}
    />
  );
}

function App() {
  const [ready, setReady] = useState(false);

  React.useEffect(() => {
    document.body.style.overflow = ready ? 'auto' : 'hidden';
  }, [ready]);

  return (
    <BrowserRouter>
      <div style={{ background: '#070608', color: '#F0EBE0', minHeight: '100vh' }}>
        <AnimatePresence>
          {!ready && <Splash onDone={() => setReady(true)} />}
        </AnimatePresence>

        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <ScrollProgress />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<CalculatorPage />} />
            </Routes>
          </motion.div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
