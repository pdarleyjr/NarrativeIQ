"""
Test UI Components
================

This module tests the Kivy UI components.
"""

import os
import sys
import pytest
from unittest.mock import patch, MagicMock
from dotenv import load_dotenv

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv(".env.local")

# Import pytest-kivy for UI testing
pytest_plugins = ('pytest_kivy',)


class TestKivyApp:
    """Test the Kivy app."""
    
    def test_app_import(self):
        """Test that the app can be imported."""
        try:
            from main import EZNarrativesApp
            assert True
        except ImportError:
            pytest.fail("Failed to import EZNarrativesApp")
    
    def test_app_creation(self):
        """Test that the app can be created."""
        try:
            from main import EZNarrativesApp
            app = EZNarrativesApp()
            assert app is not None
        except Exception as e:
            pytest.fail(f"Failed to create EZNarrativesApp: {str(e)}")
    
    @pytest.mark.skipif(os.environ.get('CI') == 'true', reason="Skip in CI environment")
    def test_app_build(self):
        """Test that the app can build its UI."""
        try:
            from main import EZNarrativesApp
            app = EZNarrativesApp()
            
            # Mock the methods that might cause issues in testing
            app.show_loading = MagicMock()
            app.hide_loading = MagicMock()
            
            # Build the app
            root = app.build()
            assert root is not None
        except Exception as e:
            pytest.fail(f"Failed to build EZNarrativesApp: {str(e)}")


class TestLoginScreen:
    """Test the LoginScreen."""
    
    def test_login_screen_creation(self):
        """Test that the LoginScreen can be created."""
        try:
            from main import LoginScreen
            from kivymd.uix.screen import MDScreen
            
            screen = LoginScreen()
            assert isinstance(screen, MDScreen)
        except Exception as e:
            pytest.fail(f"Failed to create LoginScreen: {str(e)}")
    
    def test_login_method(self):
        """Test the login method."""
        try:
            from main import LoginScreen, EZNarrativesApp
            from kivymd.app import MDApp
            
            # Create a login screen
            screen = LoginScreen()
            
            # Mock the app
            app = MagicMock()
            app.show_loading = MagicMock()
            app.hide_loading = MagicMock()
            app.root = MagicMock()
            
            # Mock MDApp.get_running_app to return our mock app
            with patch('main.MDApp.get_running_app', return_value=app):
                # Mock the ids attribute
                screen.ids = MagicMock()
                screen.ids.email.text = "test@example.com"
                screen.ids.password.text = "password123"
                
                # Call the login method
                screen.login()
                
                # Check that show_loading was called
                app.show_loading.assert_called_once()
        except Exception as e:
            pytest.fail(f"Failed to test login method: {str(e)}")


class TestSignupScreen:
    """Test the SignupScreen."""
    
    def test_signup_screen_creation(self):
        """Test that the SignupScreen can be created."""
        try:
            from main import SignupScreen
            from kivymd.uix.screen import MDScreen
            
            screen = SignupScreen()
            assert isinstance(screen, MDScreen)
        except Exception as e:
            pytest.fail(f"Failed to create SignupScreen: {str(e)}")
    
    def test_signup_method(self):
        """Test the signup method."""
        try:
            from main import SignupScreen, EZNarrativesApp
            from kivymd.app import MDApp
            
            # Create a signup screen
            screen = SignupScreen()
            
            # Mock the app
            app = MagicMock()
            app.show_loading = MagicMock()
            app.hide_loading = MagicMock()
            app.root = MagicMock()
            
            # Mock MDApp.get_running_app to return our mock app
            with patch('main.MDApp.get_running_app', return_value=app):
                # Mock the ids attribute
                screen.ids = MagicMock()
                screen.ids.name.text = "Test User"
                screen.ids.email.text = "test@example.com"
                screen.ids.password.text = "password123"
                screen.ids.confirm_password.text = "password123"
                
                # Call the signup method
                screen.signup()
                
                # Check that show_loading was called
                app.show_loading.assert_called_once()
        except Exception as e:
            pytest.fail(f"Failed to test signup method: {str(e)}")


class TestDashboardScreen:
    """Test the DashboardScreen."""
    
    def test_dashboard_screen_creation(self):
        """Test that the DashboardScreen can be created."""
        try:
            from main import DashboardScreen
            from kivymd.uix.screen import MDScreen
            
            screen = DashboardScreen()
            assert isinstance(screen, MDScreen)
        except Exception as e:
            pytest.fail(f"Failed to create DashboardScreen: {str(e)}")
    
    def test_send_message_method(self):
        """Test the send_message method."""
        try:
            from main import DashboardScreen
            
            # Create a dashboard screen
            screen = DashboardScreen()
            
            # Mock the ids attribute
            screen.ids = MagicMock()
            screen.ids.chat_input = MagicMock()
            screen.ids.chat_input.text = "Hello, world!"
            screen.ids.chat_messages = MagicMock()
            screen.ids.chat_scroll = MagicMock()
            
            # Mock the _add_message_to_chat method
            screen._add_message_to_chat = MagicMock()
            
            # Call the send_message method
            screen.send_message()
            
            # Check that _add_message_to_chat was called
            screen._add_message_to_chat.assert_called_once()
            
            # Check that chat_input.text was cleared
            assert screen.ids.chat_input.text == ""
        except Exception as e:
            pytest.fail(f"Failed to test send_message method: {str(e)}")


if __name__ == "__main__":
    # Run the tests
    pytest.main(["-xvs", __file__])