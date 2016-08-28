import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { setComposerStub } from 'react-komposer';
import PhaserInitializer from '../phaser_initializer.jsx';

storiesOf('core.PhaserInitializer', module)
  .add('default view', () => {
    return (
      <PhaserInitializer />
    );
  })
