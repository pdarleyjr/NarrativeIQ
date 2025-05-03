#!/usr/bin/env python3
"""
EZ Narratives Smoke Test
========================

This script performs basic smoke tests to verify that the application's
core functionality is working correctly.
"""

import os
import sys
import time
import unittest
from dotenv import load_dotenv

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv(".env.local")

class EZNarrativesTests(unittest.TestCase):
    """Basic smoke tests for EZ Narratives."""

    def test_environment_variables(self):
        """Test that environment variables are loaded correctly."""
        print("Testing environment variables...")
        
        # Check Supabase variables
        self.assertIsNotNone(os.getenv("VITE_SUPABASE_URL"), "VITE_SUPABASE_URL is missing")
        self.assertIsNotNone(os.getenv("VITE_SUPABASE_ANON_KEY"), "VITE_SUPABASE_ANON_KEY is missing")
        self.assertIsNotNone(os.getenv("PG_CONNECTION_STRING"), "PG_CONNECTION_STRING is missing")
        
        # Check OpenAI variables
        self.assertIsNotNone(os.getenv("OPENAI_API_KEY"), "OPENAI_API_KEY is missing")
        
        print("✅ Environment variables test passed")

    def test_database_connection(self):
        """Test database connection."""
        print("Testing database connection...")
        
        try:
            # Import here to avoid circular imports
            from lib.supabase import get_pg_connection
            
            # Get a connection
            conn = get_pg_connection()
            
            # Execute a simple query
            cursor = conn.cursor()
            cursor.execute("SELECT NOW()")
            result = cursor.fetchone()
            
            # Close the connection
            cursor.close()
            conn.close()
            
            self.assertIsNotNone(result, "Database query returned None")
            print(f"✅ Database connection test passed (current time: {result[0]})")
            
        except Exception as e:
            self.fail(f"Database connection test failed: {str(e)}")

    def test_openai_client(self):
        """Test OpenAI client initialization."""
        print("Testing OpenAI client...")
        
        try:
            # Import here to avoid circular imports
            from lib.openai_client import client, MODELS
            
            # Check that the client is initialized
            self.assertIsNotNone(client, "OpenAI client is None")
            
            # Check that models are defined
            self.assertIsNotNone(MODELS.get("CHAT"), "CHAT model is not defined")
            self.assertIsNotNone(MODELS.get("EMBEDDING"), "EMBEDDING model is not defined")
            
            print("✅ OpenAI client test passed")
            
        except Exception as e:
            self.fail(f"OpenAI client test failed: {str(e)}")

    def test_reflex_app(self):
        """Test that the Reflex app can be imported."""
        print("Testing Reflex app import...")
        
        try:
            # Try to import the app
            import app
            
            # Check that the app has the expected attributes
            self.assertTrue(hasattr(app, "states"), "app module does not have states attribute")
            
            print("✅ Reflex app import test passed")
            
        except Exception as e:
            self.fail(f"Reflex app import test failed: {str(e)}")

    def test_kivy_app(self):
        """Test that the Kivy app can be imported."""
        print("Testing Kivy app import...")
        
        try:
            # Try to import the main module
            import main
            
            # Check that the app class exists
            self.assertTrue(hasattr(main, "EZNarrativesApp"), "main module does not have EZNarrativesApp class")
            
            print("✅ Kivy app import test passed")
            
        except Exception as e:
            self.fail(f"Kivy app import test failed: {str(e)}")

def run_tests():
    """Run all tests."""
    # Create a test suite
    suite = unittest.TestSuite()
    
    # Add tests
    suite.addTest(EZNarrativesTests("test_environment_variables"))
    suite.addTest(EZNarrativesTests("test_database_connection"))
    suite.addTest(EZNarrativesTests("test_openai_client"))
    suite.addTest(EZNarrativesTests("test_reflex_app"))
    suite.addTest(EZNarrativesTests("test_kivy_app"))
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()

if __name__ == "__main__":
    print("Running EZ Narratives smoke tests...")
    print("=" * 50)
    
    start_time = time.time()
    success = run_tests()
    end_time = time.time()
    
    print("=" * 50)
    print(f"Tests completed in {end_time - start_time:.2f} seconds")
    
    if success:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print("❌ Some tests failed")
        sys.exit(1)