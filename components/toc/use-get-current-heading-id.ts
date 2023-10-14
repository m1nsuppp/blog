'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Heading } from './toc.type';

type UseGetCurrentHeadingIDParams = {
  headings: Heading[];
};

const useGetCurrentHeadingID = ({ headings }: UseGetCurrentHeadingIDParams) => {
  const headingRefs = useRef<(HTMLElement | null)[]>([]);

  const [currentHeadingID, setCurrentHeadingID] = useState<string>('');

  const intersectionObserverCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setCurrentHeadingID(entry.target.id);
      }
    });
  };

  const intersectionObserverOptions: IntersectionObserverInit = {
    threshold: 1.0,
  };

  const observer = useMemo(
    () => new IntersectionObserver(intersectionObserverCallback, intersectionObserverOptions),
    [],
  );

  useEffect(() => {
    headingRefs.current = headings.map((heading) => {
      return document.getElementById(heading.id);
    });
  }, []);

  useEffect(() => {
    if (headingRefs) {
      headingRefs.current.forEach((heading) => observer.observe(heading!));
    }

    return () => {
      observer.disconnect();
    };
  }, [headingRefs, observer]);

  return { currentHeadingID };
};

export default useGetCurrentHeadingID;
