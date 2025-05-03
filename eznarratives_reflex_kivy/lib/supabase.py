import os
import psycopg2
from dotenv import load_dotenv
from supabase import create_client, Client

# Determine environment and load appropriate .env file
env = os.getenv("APP_ENV", "development")
env_file = ".env.production" if env == "production" else ".env.local"

# Load environment variables
if os.path.exists(env_file):
    load_dotenv(env_file)
else:
    # Fallback to .env.local if the specific environment file doesn't exist
    load_dotenv(".env.local")
    print(f"Warning: {env_file} not found, falling back to .env.local")

# Get Supabase credentials
supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Get PostgreSQL connection string
dsn = os.getenv("PG_CONNECTION_STRING")
if not dsn:
    raise RuntimeError("PG_CONNECTION_STRING is missing in environment variables")

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

# Create PostgreSQL connection
def get_pg_connection():
    """Get a PostgreSQL connection using the connection string from environment variables."""
    try:
        connection = psycopg2.connect(dsn)
        return connection
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")
        raise

# Function to check if Supabase is properly configured
def is_supabase_configured() -> bool:
    """Check if Supabase is properly configured."""
    return bool(supabase_url) and bool(supabase_key)

# Function to get the current user
async def get_current_user():
    """Get the current authenticated user."""
    try:
        response = await supabase.auth.get_user()
        return response.user
    except Exception as e:
        print(f"Error getting current user: {e}")
        return None

# Function to sign in with email and password
async def sign_in_with_email_password(email: str, password: str):
    """Sign in a user with email and password."""
    try:
        response = await supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return response
    except Exception as e:
        print(f"Error signing in: {e}")
        raise

# Function to sign out
async def sign_out():
    """Sign out the current user."""
    try:
        await supabase.auth.sign_out()
        return True
    except Exception as e:
        print(f"Error signing out: {e}")
        return False

# Function to check if a user has admin role
async def check_admin_status(user_id: str):
    """Check if the user has admin role."""
    try:
        response = await supabase.table("user_roles").select("role").eq("user_id", user_id).execute()
        if response.data:
            return response.data[0].get("role") == "admin"
        return False
    except Exception as e:
        print(f"Error checking admin status: {e}")
        return False