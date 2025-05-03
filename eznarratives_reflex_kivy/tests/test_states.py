"""
Test State Classes
=================

This module tests the Reflex state classes.
"""

import os
import sys
import pytest
import asyncio
from unittest.mock import patch, MagicMock
from dotenv import load_dotenv

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv(".env.local")

from app.states.session_state import SessionState
from app.states.ui_state import UIState
from app.states.ems_state import EMSState
from app.states.fire_state import FireState


class TestSessionState:
    """Test the SessionState class."""
    
    @pytest.mark.asyncio
    async def test_login(self):
        """Test the login method."""
        # Create a session state
        session_state = SessionState()
        
        # Set email and password
        session_state.email = "test@example.com"
        session_state.password = "password123"
        
        # Mock the sign_in_with_email_password function
        with patch('app.states.session_state.sign_in_with_email_password') as mock_sign_in:
            # Create a mock response
            mock_user = {"id": "123", "email": "test@example.com", "user_metadata": {"full_name": "Test User"}}
            mock_response = MagicMock()
            mock_response.user = mock_user
            mock_sign_in.return_value = mock_response
            
            # Mock the check_admin_status function
            with patch('app.states.session_state.check_admin_status', return_value=False):
                # Mock the load_sessions method
                with patch.object(session_state, 'load_sessions'):
                    # Call the login method
                    result = await session_state.login()
                    
                    # Check that the user is set
                    assert session_state.user == mock_user
                    assert session_state.user_email == "test@example.com"
                    assert session_state.user_name == "Test User"
                    assert session_state.is_admin is False
                    
                    # Check that sign_in_with_email_password was called with the correct arguments
                    mock_sign_in.assert_called_once_with("test@example.com", "password123")
    
    @pytest.mark.asyncio
    async def test_signup(self):
        """Test the signup method."""
        # Create a session state
        session_state = SessionState()
        
        # Set form values
        session_state.name = "Test User"
        session_state.email = "test@example.com"
        session_state.password = "password123"
        session_state.confirm_password = "password123"
        
        # Mock the supabase auth.sign_up method
        with patch('app.states.session_state.supabase.auth.sign_up') as mock_sign_up:
            # Create a mock response
            mock_user = {"id": "123", "email": "test@example.com", "user_metadata": {"full_name": "Test User"}}
            mock_response = MagicMock()
            mock_response.user = mock_user
            mock_sign_up.return_value = mock_response
            
            # Mock the load_sessions method
            with patch.object(session_state, 'load_sessions'):
                # Call the signup method
                result = await session_state.signup()
                
                # Check that the user is set
                assert session_state.user == mock_user
                assert session_state.user_email == "test@example.com"
                assert session_state.user_name == "Test User"
                
                # Check that sign_up was called with the correct arguments
                mock_sign_up.assert_called_once()


class TestUIState:
    """Test the UIState class."""
    
    @pytest.mark.asyncio
    async def test_toggle_dark_mode(self):
        """Test the toggle_dark_mode method."""
        # Create a UI state
        ui_state = UIState()
        
        # Set initial state
        ui_state.is_dark_mode = False
        
        # Mock the client_side method
        with patch('reflex.state.State.client_side'):
            # Toggle dark mode
            await ui_state.toggle_dark_mode()
            
            # Check that dark mode is toggled
            assert ui_state.is_dark_mode is True
            
            # Toggle dark mode again
            await ui_state.toggle_dark_mode()
            
            # Check that dark mode is toggled back
            assert ui_state.is_dark_mode is False
    
    @pytest.mark.asyncio
    async def test_set_active_tab(self):
        """Test the set_active_tab method."""
        # Create a UI state
        ui_state = UIState()
        
        # Set initial state
        ui_state.active_tab = "chat"
        
        # Set active tab
        await ui_state.set_active_tab("ems")
        
        # Check that active tab is set
        assert ui_state.active_tab == "ems"
        
        # Set active tab again
        await ui_state.set_active_tab("fire")
        
        # Check that active tab is set
        assert ui_state.active_tab == "fire"


class TestEMSState:
    """Test the EMSState class."""
    
    def test_form_data(self):
        """Test the form_data property."""
        # Create an EMS state
        ems_state = EMSState()
        
        # Set some form values
        ems_state.unit = "Medic 1"
        ems_state.dispatch_reason = "123 Main St for chest pain"
        ems_state.patient_sex = "Male"
        ems_state.patient_age = "65"
        ems_state.chief_complaint = "Chest pain"
        
        # Get the form data
        form_data = ems_state.form_data
        
        # Check that the form data contains the expected values
        assert form_data["unit"] == "Medic 1"
        assert form_data["dispatch_reason"] == "123 Main St for chest pain"
        assert form_data["patient_sex"] == "Male"
        assert form_data["patient_age"] == "65"
        assert form_data["chief_complaint"] == "Chest pain"
    
    @pytest.mark.asyncio
    async def test_prefill_form(self):
        """Test the prefill_form method."""
        # Create an EMS state
        ems_state = EMSState()
        
        # Mock the UIState
        with patch('app.states.ems_state.UIState') as mock_ui_state:
            # Create a mock UI state
            mock_ui_state_instance = MagicMock()
            mock_ui_state_instance.narrative_settings = {
                "default_unit": "Medic 1",
                "default_hospital": "Memorial Hospital"
            }
            mock_ui_state.get_current_state.return_value = mock_ui_state_instance
            
            # Call the prefill_form method
            await ems_state.prefill_form()
            
            # Check that the form is prefilled with the expected values
            assert ems_state.unit == "Medic 1"
            assert ems_state.dispatch_reason == "123 Main St for chest pain"
            assert ems_state.patient_sex == "Male"
            assert ems_state.patient_age == "65"
            assert ems_state.chief_complaint == "Chest pain"
            assert ems_state.transport_destination == "Memorial Hospital"


class TestFireState:
    """Test the FireState class."""
    
    def test_form_data(self):
        """Test the form_data property."""
        # Create a Fire state
        fire_state = FireState()
        
        # Set some form values
        fire_state.unit = "Engine 3"
        fire_state.emergency_type = "Structure Fire"
        fire_state.additional_info = "Two-story residential structure with heavy smoke showing from second floor."
        
        # Get the form data
        form_data = fire_state.form_data
        
        # Check that the form data contains the expected values
        assert form_data["unit"] == "Engine 3"
        assert form_data["emergency_type"] == "Structure Fire"
        assert form_data["additional_info"] == "Two-story residential structure with heavy smoke showing from second floor."
    
    @pytest.mark.asyncio
    async def test_prefill_form(self):
        """Test the prefill_form method."""
        # Create a Fire state
        fire_state = FireState()
        
        # Mock the UIState
        with patch('app.states.fire_state.UIState') as mock_ui_state:
            # Create a mock UI state
            mock_ui_state_instance = MagicMock()
            mock_ui_state_instance.narrative_settings = {
                "default_unit": "Engine 3"
            }
            mock_ui_state.get_current_state.return_value = mock_ui_state_instance
            
            # Call the prefill_form method
            await fire_state.prefill_form()
            
            # Check that the form is prefilled with the expected values
            assert fire_state.unit == "Engine 3"
            assert fire_state.emergency_type == "Structure Fire"
            assert fire_state.additional_info == "Standard fire protocols followed."


if __name__ == "__main__":
    # Run the tests
    pytest.main(["-xvs", __file__])