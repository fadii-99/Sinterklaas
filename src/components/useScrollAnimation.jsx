import { useEffect } from 'react';

const useScrollAnimation = (selector, animationClass) => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.01, // Adjusted to ensure early trigger
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(selector);

    if (elementsToAnimate.length > 0) { // Ensure elements exist
      elementsToAnimate.forEach(element => observer.observe(element));
    }

    return () => {
      if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(element => observer.unobserve(element));
      }
    };
  }, [selector, animationClass]); // Dependency array ensures the effect runs only when dependencies change
};

export default useScrollAnimation;
