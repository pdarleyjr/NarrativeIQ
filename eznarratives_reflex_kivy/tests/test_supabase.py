"""
Test Supabase Connection
========================

This module tests the connection to Supabase.
"""

import os
import sys
import pytest
import asyncio
from dotenv import load_dotenv

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv(".env.local")

from lib.supabase import supabase, is_supabase_configured, get_pg_connection


def test_supabase_configured():
    """Test that Supabase is configured."""
    assert is_supabase_configured(), "Supabase is not configured"


@pytest.mark.asyncio
async def test_supabase_auth():
    """Test Supabase auth connection."""
    try:
        # Just test that we can access the auth API
        response = await supabase.auth.get_session()
        assert response is not None
    except Exception as e:
        pytest.fail(f"Supabase auth connection failed: {str(e)}")


@pytest.mark.asyncio
async def test_supabase_database():
    """Test Supabase database connection."""
    try:
        # Execute a simple query
        response = await supabase.from_("narratives").select("count", count="exact").limit(1).execute()
        assert response is not None
    except Exception as e:
        pytest.fail(f"Supabase database connection failed: {str(e)}")


def test_postgres_connection():
    """Test direct PostgreSQL connection."""
    try:
        conn = get_pg_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT NOW()")
        result = cursor.fetchone()
        assert result is not None, "Failed to execute query"
        cursor.close()
        conn.close()
    except Exception as e:
        pytest.fail(f"PostgreSQL connection failed: {str(e)}")


if __name__ == "__main__":
    # Run the async tests
    loop = asyncio.get_event_loop()
    loop.run_until_complete(test_supabase_auth())
    loop.run_until_complete(test_supabase_database())
    
    # Run the sync tests
    test_supabase_configured()
    test_postgres_connection()
    
    print("All Supabase tests passed!")