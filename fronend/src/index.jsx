import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

// Import styles
import './styles/variables.css';
import './styles/globals.css';
import './styles/components.css';
import './App.css';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You could also send error to logging service here
    if (import.meta.env.PROD) {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#F9FAFB'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#EF4444', 
              marginBottom: '1rem',
              fontSize: '1.5rem' 
            }}>
              Oops! Something went wrong
            </h1>
            
            <p style={{ 
              color: '#6B7280', 
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              We apologize for the inconvenience. The application encountered an unexpected error.
            </p>
            
            {import.meta.env.DEV && (
              <details style={{ 
                marginBottom: '1.5rem',
                textAlign: 'left',
                backgroundColor: '#F3F4F6',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <summary style={{ 
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Error Details (Development)
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  color: '#EF4444'
                }}>
                  {this.state.error && this.state.error.toString()}
                </pre>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  color: '#6B7280',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Reload Page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get the root element
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Mark app as loaded to hide initial loading spinner
document.body.classList.add('app-loaded');

// Hot Module Replacement (HMR) - Vite
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Performance monitoring
if (import.meta.env.PROD) {
  // Web Vitals reporting
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  }).catch(() => {
    // Silently fail if web-vitals is not available
  });
}

// Console greeting (development only)
if (import.meta.env.DEV) {
  console.log(`
    🚀 Finance Tracker Development Mode
    
    App Version: ${__APP_VERSION__ || 'unknown'}
    Build Time: ${__BUILD_TIME__ || 'unknown'}
    
    Environment: ${import.meta.env.MODE}
    API URL: ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
    
    Happy coding! 💰
  `);
}
