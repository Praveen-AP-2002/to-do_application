import { useState } from 'react';
import { useCookies } from 'react-cookie';

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogin, setLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const viewLogin = (status) => {
    setLogin(status);
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    const data = await response.json();

    if (data.details) {
      setError(data.details);
    } else {
      setCookie('Email', data.email);
      setCookie('AuthToken', data.token);

      window.location.reload();
    }
  };

  // Determine if the form is valid (all fields filled)
  const isFormValid = isLogin
    ? email && password // For login, only email and password are required
    : email && password && confirmPassword; // For signup, all fields are required

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <h1 className="todo-list-title">🎯 To-Do List</h1>
        <form>
          <h2>{isLogin ? 'Please Log in' : 'Please sign up!'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isLogin}
            />
          )}
          <div className="show-password">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          {error && <p>{error}</p>}
          <input
            type="submit"
            className="create"
            onClick={(e) => handleSubmit(e, isLogin ? 'Login' : 'Signup')}
            disabled={!isFormValid} // Disable the button if form is not valid
          />
        </form>
        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !isLogin ? 'rgb(255,255,255)' : 'rgb(188,188,188)',
            }}
          >
            Signup
          </button>
          <button
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: isLogin ? 'rgb(255,255,255)' : 'rgb(188,188,188)',
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
