import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Leaf, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="organic-login-container">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
                
                .organic-login-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f3ef 0%, #e8e4dc 50%, #d4cfc4 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Lora', serif;
                }
                
                .organic-login-container::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -20%;
                    width: 80%;
                    height: 120%;
                    background: radial-gradient(ellipse at center, rgba(139, 115, 85, 0.08) 0%, transparent 70%);
                    border-radius: 50% 40% 60% 50%;
                    animation: breathe 8s ease-in-out infinite;
                }
                
                .organic-login-container::after {
                    content: '';
                    position: absolute;
                    bottom: -30%;
                    left: -15%;
                    width: 60%;
                    height: 80%;
                    background: radial-gradient(ellipse at center, rgba(106, 124, 94, 0.06) 0%, transparent 70%);
                    border-radius: 60% 50% 40% 60%;
                    animation: breathe 10s ease-in-out infinite reverse;
                }
                
                @keyframes breathe {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.1) rotate(5deg); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .organic-card {
                    position: relative;
                    z-index: 10;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    border-radius: 40px;
                    padding: 3.5rem 3rem;
                    max-width: 480px;
                    width: 100%;
                    box-shadow: 
                        0 20px 60px rgba(139, 115, 85, 0.15),
                        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                    animation: fadeInUp 0.8s ease-out;
                }
                
                .organic-leaf-icon {
                    width: 48px;
                    height: 48px;
                    color: #6a7c5e;
                    margin: 0 auto 1.5rem;
                    display: block;
                    animation: float 4s ease-in-out infinite;
                }
                
                .organic-title {
                    font-family: 'Crimson Pro', serif;
                    font-size: 2.5rem;
                    font-weight: 300;
                    color: #3d3d3d;
                    text-align: center;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.02em;
                }
                
                .organic-subtitle {
                    font-size: 0.95rem;
                    color: #7a7a7a;
                    text-align: center;
                    margin-bottom: 2.5rem;
                    font-style: italic;
                }
                
                .organic-form-group {
                    margin-bottom: 1.75rem;
                }
                
                .organic-label {
                    display: block;
                    font-size: 0.875rem;
                    color: #5a5a5a;
                    margin-bottom: 0.5rem;
                    font-weight: 400;
                    letter-spacing: 0.02em;
                }
                
                .organic-input-wrapper {
                    position: relative;
                    background: rgba(255, 255, 255, 0.6);
                    border: 1.5px solid rgba(139, 115, 85, 0.2);
                    border-radius: 20px;
                    transition: all 0.3s ease;
                }
                
                .organic-input-wrapper:focus-within {
                    border-color: #8b7355;
                    background: rgba(255, 255, 255, 0.9);
                    box-shadow: 0 4px 20px rgba(139, 115, 85, 0.1);
                }
                
                .organic-input {
                    width: 100%;
                    padding: 1rem 1.25rem;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 0.95rem;
                    color: #3d3d3d;
                    font-family: 'Lora', serif;
                }
                
                .organic-input::placeholder {
                    color: #a0a0a0;
                    font-style: italic;
                }
                
                .organic-eye-button {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #8b7355;
                    transition: color 0.3s ease;
                }
                
                .organic-eye-button:hover {
                    color: #6a5a45;
                }
                
                .organic-remember-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    font-size: 0.875rem;
                }
                
                .organic-checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #5a5a5a;
                    cursor: pointer;
                }
                
                .organic-checkbox {
                    width: 18px;
                    height: 18px;
                    border: 1.5px solid #8b7355;
                    border-radius: 4px;
                    cursor: pointer;
                    accent-color: #6a7c5e;
                }
                
                .organic-link {
                    color: #6a7c5e;
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-style: italic;
                }
                
                .organic-link:hover {
                    color: #4a5c3e;
                    text-decoration: underline;
                }
                
                .organic-button {
                    width: 100%;
                    padding: 1.1rem;
                    background: linear-gradient(135deg, #6a7c5e 0%, #8b9d7f 100%);
                    border: none;
                    border-radius: 20px;
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(106, 124, 94, 0.25);
                    font-family: 'Lora', serif;
                    letter-spacing: 0.03em;
                }
                
                .organic-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(106, 124, 94, 0.35);
                }
                
                .organic-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .organic-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .organic-divider {
                    text-align: center;
                    margin: 2rem 0;
                    position: relative;
                    color: #9a9a9a;
                    font-size: 0.875rem;
                    font-style: italic;
                }
                
                .organic-divider::before,
                .organic-divider::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 40%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(139, 115, 85, 0.2), transparent);
                }
                
                .organic-divider::before {
                    left: 0;
                }
                
                .organic-divider::after {
                    right: 0;
                }
                
                .organic-footer-text {
                    text-align: center;
                    margin-top: 2rem;
                    color: #7a7a7a;
                    font-size: 0.9rem;
                }
                
                .organic-footer-link {
                    color: #6a7c5e;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                
                .organic-footer-link:hover {
                    color: #4a5c3e;
                    text-decoration: underline;
                }
                
                @media (max-width: 640px) {
                    .organic-card {
                        padding: 2.5rem 2rem;
                    }
                    
                    .organic-title {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className="organic-card">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors z-20"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
                
                <Leaf className="organic-leaf-icon" strokeWidth={1.5} />
                
                <h1 className="organic-title">Welcome back</h1>
                <p className="organic-subtitle">Step into your sanctuary of productivity</p>

                <form onSubmit={handleSubmit}>
                    <div className="organic-form-group">
                        <label className="organic-label">Email Address</label>
                        <div className="organic-input-wrapper">
                            <input
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                className="organic-input"
                            />
                        </div>
                    </div>

                    <div className="organic-form-group">
                        <label className="organic-label">Password</label>
                        <div className="organic-input-wrapper">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                required
                                className="organic-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="organic-eye-button"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="organic-remember-row">
                        <label className="organic-checkbox-label">
                            <input type="checkbox" name="rememberMe" className="organic-checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                toast.error('Password reset not implemented yet');
                            }}
                            className="organic-link"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" disabled={loading} className="organic-button">
                        {loading ? <div className="organic-spinner" /> : 'Sign In'}
                    </button>
                </form>

                <div className="organic-divider">or continue with</div>

                <p className="organic-footer-text">
                    New to our garden?{' '}
                    <Link to="/register" className="organic-footer-link">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
