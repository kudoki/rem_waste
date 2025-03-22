import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  children: ReactNode;
  wrapperId?: string;
};

const Portal = ({ children, wrapperId = 'portal-wrapper' }: PortalProps) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = document.createElement('div');
      element.setAttribute('id', wrapperId);
      element.setAttribute('style', 'position: fixed; z-index: 1000; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none');
      document.body.appendChild(element);
    }

    setWrapperElement(element);

    return () => {
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (!wrapperElement) return null;

  return createPortal(children, wrapperElement);
};

export default Portal; 