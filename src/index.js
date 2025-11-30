import React from 'react';
import { createRoot } from 'react-dom/client';
import BlockyPage from './components/game/BlockyPage.jsx';

import './styles/index.scss';

const dataComponentAttr = 'data-component';
Array.from(document.getElementsByTagName('div'))
.filter(div => div.hasAttribute(dataComponentAttr))
.forEach(div => {
  const component = div.getAttribute(dataComponentAttr);
  switch(component) {
    case 'reactBlocky':
      createRoot(div).render(<BlockyPage />);
      break;
    default:
      console.warn(`No such component ${component}`);
      return;
  }
});
