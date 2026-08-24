import React from 'react';
import { UserMenu } from '../auth/UserMenu';

export const Masthead: React.FC = () => {
  return (
    <header className="masthead">
      <h1 className="masthead-title">
        Siftly <em>EAA</em>
      </h1>
      <UserMenu />
    </header>
  );
};
