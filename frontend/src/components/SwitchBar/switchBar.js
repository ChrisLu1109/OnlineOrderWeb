import React from 'react';

const SwitchBar = ({ onLogin, onSignUp }) => {
  const [active, setActive] = React.useState('login'); // 'login' or 'signup'

  return (
    <div className="switch-bar">
      <button
        className={`switch-option ${active === 'signup' ? '' : 'active'}`}
        onClick={() => {
          setActive('login');
          onLogin();
        }}
      >
        Log in
      </button>
      <button
        className={`switch-option ${active === 'signup' ? 'active' : ''}`}
        onClick={() => {
          setActive('signup');
          onSignUp();
        }}
      >
        Sign up
      </button>
    </div>
  );
};

export default SwitchBar;
