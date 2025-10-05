import { useState, useEffect } from 'react';

// Helper function to generate random coordinates in the desired format
const generateRandomCoords = () => {
  const lat = (Math.random() * 90).toFixed(4);
  const lon = (Math.random() * 180).toFixed(4);
  const latDir = Math.random() > 0.5 ? 'N' : 'S';
  const lonDir = Math.random() > 0.5 ? 'E' : 'W';
  return `${lat}${latDir} ${lon}${lonDir}`;
};

export default function RandomCoords() {
  const [fullText, setFullText] = useState(generateRandomCoords());
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  // Constants for animation speed
  const typingSpeed = 120;
  const deletingSpeed = 60;
  const pauseDuration = 2000; // Pause after typing completes

  useEffect(() => {
    const handleTyping = () => {
      // Determine if we are typing or deleting
      if (isDeleting) {
        // Deleting logic
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
      } else {
        // Typing logic
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
      }

      // Logic to switch between typing and deleting
      if (!isDeleting && displayedText === fullText) {
        // Finished typing, pause and then start deleting
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && displayedText === '') {
        // Finished deleting, generate new coords and start typing again
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setFullText(generateRandomCoords());
      }
    };

    // Set the interval for the animation
    const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    // Cleanup function to clear the timeout
    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, fullText, loopNum]);

  return (
    <span>
      COORDS: {displayedText}
      <span className="cursor">|</span>
    </span>
  );
}