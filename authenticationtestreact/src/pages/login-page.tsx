import { useState, type FormEvent } from 'react';
import httpClient from '../axios.config';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userName, setUserName] = useState<string>('admin');
  const [password, setPassword] = useState<string>('Dev@1234');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response = await httpClient.post('api/auth/login', {
        userName,
        password,
      });

    //   localStorage.setItem("bearer-token", response.data.token)
    localStorage.setItem("authResult", JSON.stringify(response.data))
    navigate(searchParams.get('redirectTo')??'/')

    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20, display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{textAlign: 'center'}}>Login</h2>
        <div>
          <label htmlFor="userName">Email:</label><br />
          <input
            id="userName"
            type="text"
            value={userName}
            autoComplete="username"
            onChange={e => setUserName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label htmlFor="password">Password:</label><br />
          <input
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: 20 }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && (
          <div style={{ color: 'red', marginTop: 10 }}>{error}</div>
        )}
      </form>
    </div>
  </>
  );
};
