import React from 'react';
import {render} from 'react-dom';
import Root from 'components/root'
import injectTapEventPlugin from 'react-tap-event-plugin';
import './index.scss';

injectTapEventPlugin();

render(
  <Root />,
  document.getElementById('root')
);
