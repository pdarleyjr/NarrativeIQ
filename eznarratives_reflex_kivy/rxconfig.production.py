import os
import reflex as rx

# Production configuration for Reflex application

# Load environment variables
env_file = ".env.production"
if os.path.exists(env_file):
    from dotenv import load_dotenv
    load_dotenv(env_file)
else:
    print(f"Warning: {env_file} not found, environment variables may not be properly set")

# Application configuration
config = rx.Config(
    app_name="eznarratives",
    app_title="EZ Narratives",
    app_description="Professional EMS and Fire narrative generation application",
    api_url="https://eznarratives.com/api",
    env="production",
    db_url=os.getenv("PG_CONNECTION_STRING"),
    frontend_packages=[
        "framer-motion",
        "@lottiefiles/react-lottie-player",
    ],
    tailwind={
        "theme": {
            "extend": {
                "colors": {
                    "primary": {
                        "50": "#f0f9ff",
                        "100": "#e0f2fe",
                        "200": "#bae6fd",
                        "300": "#7dd3fc",
                        "400": "#38bdf8",
                        "500": "#0ea5e9",
                        "600": "#0284c7",
                        "700": "#0369a1",
                        "800": "#075985",
                        "900": "#0c4a6e",
                    },
                    "secondary": {
                        "50": "#f8fafc",
                        "100": "#f1f5f9",
                        "200": "#e2e8f0",
                        "300": "#cbd5e1",
                        "400": "#94a3b8",
                        "500": "#64748b",
                        "600": "#475569",
                        "700": "#334155",
                        "800": "#1e293b",
                        "900": "#0f172a",
                    },
                }
            }
        }
    },
    # Production-specific settings
    telemetry_enabled=False,  # Disable telemetry in production
    deploy_url="https://eznarratives.com",  # Production URL
    backend_port=8000,  # Backend API port
    frontend_port=3000,  # Frontend port during development (not used in production)
    
    # Production build settings
    build_path="build",  # Output directory for the build
    frontend_build_dir="frontend/build",  # Directory for the frontend build
    
    # Caching settings for production
    cache_backend="redis",  # Use Redis for caching in production
    redis_url=os.getenv("REDIS_URL", "redis://localhost:6379"),
    
    # Logging configuration for production
    log_level="ERROR",  # Only log errors in production
    
    # Security settings
    cors_allowed_origins=[
        "https://eznarratives.com",
        "https://www.eznarratives.com",
    ],
    
    # Performance settings
    compression=True,  # Enable compression
    minify=True,  # Minify output
    
    # PWA settings
    pwa={
        "name": "EZ Narratives",
        "short_name": "EZNarr",
        "description": "Professional EMS and Fire narrative generation",
        "theme_color": "#0ea5e9",
        "background_color": "#ffffff",
        "display": "standalone",
        "orientation": "portrait",
        "scope": "/",
        "start_url": "/",
        "icons": [
            {
                "src": "/icons/icon-72x72.png",
                "sizes": "72x72",
                "type": "image/png"
            },
            {
                "src": "/icons/icon-96x96.png",
                "sizes": "96x96",
                "type": "image/png"
            },
            {
                "src": "/icons/icon-128x128.png",
                "sizes": "128x128",
                "type": "image/png"
            },
            {
                "src": "/icons/icon-144x144.png",
                "sizes": "144x144",
                "type": "image/png"
            },
            {
                "src": "/icons/icon-152x152.png",
                "sizes": "152x152",
                "type": "image/png"
            },
            {
                "src": "/icons/icon-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/icons/icon-384x384.png",
                "sizes": "384x384",
                "type": "image/png"
            },
            {
                "src": "/icons/icon-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    }
)