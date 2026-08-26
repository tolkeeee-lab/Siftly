'use client';

import React from 'react';
import { UserMenu } from '../auth/UserMenu';
import { RoleSwitcher } from './RoleSwitcher';

export const Masthead: React.FC = () => {
  return (
    <header className="masthead">
      <h1 className="masthead-title">
        Siftly <em>EAA</em>
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RoleSwitcher />
        <UserMenu />
      </div>
    </header>
  );
};
