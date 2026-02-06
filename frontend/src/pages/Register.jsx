
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register({ name, email, password });
            toast.success('Welcome to the garden! 🌱');
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="organic-register-container">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
                
                .organic-register-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Lora', serif;
                }
                
                .organic-register-container::before {
                    content: '';
                    position: absolute;
                    top: -40%;
                    left: -15%;
                    width: 70%;
                    height: 100%;
                    background: radial-gradient(ellipse at center, rgba(106, 124, 94, 0.12) 0%, transparent 70%);
                    border-radius: 60% 50% 40% 60%;
                    animation: breathe 9s ease-in-out infinite;
                }
                
                .organic-register-container::after {
                    content: '';
                    position: absolute;
                    bottom: -35%;
                    right: -10%;
                    width: 65%;
                    height: 90%;
                    background: radial-gradient(ellipse at center, rgba(139, 195, 74, 0.08) 0%, transparent 70%);
                    border-radius: 50% 60% 50% 40%;
                    animation: breathe 11s ease-in-out infinite reverse;
                }
                
                @keyframes breathe {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.15) rotate(-5deg); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-5deg); }
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
                
                .organic-register-card {
                    position: relative;
                    z-index: 10;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    border-radius: 40px;
                    padding: 3.5rem 3rem;
                    max-width: 480px;
                    width: 100%;
                    box-shadow: 
                        0 20px 60px rgba(106, 124, 94, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.6) inset;
                    animation: fadeInUp 0.8s ease-out;
                }
                
                .organic-sprout-icon {
                    width: 48px;
                    height: 48px;
                    color: #6a7c5e;
                    margin: 0 auto 1.5rem;
                    display: block;
                    animation: float 3.5s ease-in-out infinite;
                }
                
                .organic-register-title {
                    font-family: 'Crimson Pro', serif;
                    font-size: 2.5rem;
                    font-weight: 300;
                    color: #2d3d2d;
                    text-align: center;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.02em;
                }
                
                .organic-register-subtitle {
                    font-size: 0.95rem;
                    color: #6a7a6a;
                    text-align: center;
                    margin-bottom: 2.5rem;
                    font-style: italic;
                }
                
                .organic-register-form-group {
                    margin-bottom: 1.5rem;
                }
                
                .organic-register-label {
                    display: block;
                    font-size: 0.875rem;
                    color: #4a5a4a;
                    margin-bottom: 0.5rem;
                    font-weight: 400;
                    letter-spacing: 0.02em;
                }
                
                .organic-register-input-wrapper {
                    position: relative;
                    background: rgba(255, 255, 255, 0.7);
                    border: 1.5px solid rgba(106, 124, 94, 0.25);
                    border-radius: 20px;
                    transition: all 0.3s ease;
                }
                
                .organic-register-input-wrapper:focus-within {
                    border-color: #6a7c5e;
                    background: rgba(255, 255, 255, 0.95);
                    box-shadow: 0 4px 20px rgba(106, 124, 94, 0.15);
                }
                
                .organic-register-input {
                    width: 100%;
                    padding: 1rem 1.25rem;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 0.95rem;
                    color: #2d3d2d;
                    font-family: 'Lora', serif;
                }
                
                .organic-register-input::placeholder {
                    color: #9a9a9a;
                    font-style: italic;
                }
                
                .organic-register-eye-button {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6a7c5e;
                    transition: color 0.3s ease;
                }
                
                .organic-register-eye-button:hover {
                    color: #4a5c3e;
                }
                
                .organic-register-button {
                    width: 100%;
                    padding: 1.1rem;
                    background: linear-gradient(135deg, #6a7c5e 0%, #8bbc4a 100%);
                    border: none;
                    border-radius: 20px;
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(106, 124, 94, 0.3);
                    font-family: 'Lora', serif;
                    letter-spacing: 0.03em;
                    margin-top: 1rem;
                }
                
                .organic-register-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(106, 124, 94, 0.4);
                }
                
                .organic-register-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .organic-register-spinner {
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
                
                .organic-register-divider {
                    text-align: center;
                    margin: 2rem 0;
                    position: relative;
                    color: #8a8a8a;
                    font-size: 0.875rem;
                    font-style: italic;
                }
                
                .organic-register-divider::before,
                .organic-register-divider::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 40%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(106, 124, 94, 0.25), transparent);
                }
                
                .organic-register-divider::before {
                    left: 0;
                }
                
                .organic-register-divider::after {
                    right: 0;
                }
                
                .organic-register-footer-text {
                    text-align: center;
                    margin-top: 2rem;
                    color: #6a7a6a;
                    font-size: 0.9rem;
                }
                
                .organic-register-footer-link {
                    color: #6a7c5e;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                
                .organic-register-footer-link:hover {
                    color: #4a5c3e;
                    text-decoration: underline;
                }
                
                @media (max-width: 640px) {
                    .organic-register-card {
                        padding: 2.5rem 2rem;
                    }
                    
                    .organic-register-title {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className="organic-register-card">
                <Sprout className="organic-sprout-icon" strokeWidth={1.5} />
                
                <h1 className="organic-register-title">Plant your roots</h1>
                <p className="organic-register-subtitle">Begin your journey of growth and productivity</p>

                <form onSubmit={handleSubmit}>
                    <div className="organic-register-form-group">
                        <label className="organic-register-label">Full Name</label>
                        <div className="organic-register-input-wrapper">
                            <input
                                name="name"
                                type="text"
                                placeholder="Your name"
                                required
                                className="organic-register-input"
                            />
                        </div>
                    </div>

                    <div className="organic-register-form-group">
                        <label className="organic-register-label">Email Address</label>
                        <div className="organic-register-input-wrapper">
                            <input
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                className="organic-register-input"
                            />
                        </div>
                    </div>

                    <div className="organic-register-form-group">
                        <label className="organic-register-label">Password</label>
                        <div className="organic-register-input-wrapper">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                required
                                minLength="6"
                                className="organic-register-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="organic-register-eye-button"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="organic-register-form-group">
                        <label className="organic-register-label">Confirm Password</label>
                        <div className="organic-register-input-wrapper">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                required
                                minLength="6"
                                className="organic-register-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="organic-register-eye-button"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="organic-register-button">
                        {loading ? <div className="organic-register-spinner" /> : 'Create Account'}
                    </button>
                </form>

                <div className="organic-register-divider">or continue with</div>

                <p className="organic-register-footer-text">
                    Already part of our garden?{' '}
                    <Link to="/login" className="organic-register-footer-link">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
