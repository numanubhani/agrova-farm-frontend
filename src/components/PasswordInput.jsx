import { useState } from 'react';
import Icon from './Icon';

export default function PasswordInput({ value, onChange, autoComplete, autoFocus }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pwfield">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        className="pweye"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        <Icon name={show ? 'eyeOff' : 'eye'} />
      </button>
    </div>
  );
}
