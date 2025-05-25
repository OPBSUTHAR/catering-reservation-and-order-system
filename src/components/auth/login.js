// src/components/Auth/Login.js
import React, { useState } from 'react';
import { auth } from '../../services/authService';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
    /* CSS-in-JS styles */
    background: white;
    border-radius: 15px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 450px;
    width: 100%;
`;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            history.push('/dashboard');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <h1>Login</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </LoginContainer>
    );
};

export default Login;