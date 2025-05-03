"""
Test OpenAI Client
=================

This module tests the OpenAI client functionality.
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

from lib.openai_client import generate_ems_narrative, generate_fire_narrative


class MockResponse:
    """Mock response for OpenAI API calls."""
    
    def __init__(self, content):
        self.choices = [MagicMock(message=MagicMock(content=content))]


@pytest.mark.asyncio
async def test_generate_ems_narrative():
    """Test generating an EMS narrative."""
    # Sample form data
    form_data = {
        "unit": "Medic 1",
        "dispatch_reason": "123 Main St for chest pain",
        "patient_sex": "Male",
        "patient_age": "65",
        "chief_complaint": "Chest pain",
        "duration": "30 minutes",
        "patient_presentation": "Patient found sitting upright in chair, clutching chest.",
        "aao_person": True,
        "aao_place": True,
        "aao_time": True,
        "aao_event": True,
        "gcs_score": "15",
        "pupils": "PERRL",
        "vital_signs_normal": False,
        "selected_abnormal_vitals": ["Hypertensive", "Tachycardic"],
        "all_other_vitals_normal": True,
        "dcap_btls": True,
        "treatment_provided": "Administered 324mg aspirin PO, established IV access.",
        "transport_destination": "Memorial Hospital",
        "transport_position": "Position of comfort",
    }
    
    # Expected narrative
    expected_narrative = """EMS NARRATIVE REPORT

=== DISPATCH ===
Medic 1 dispatched to 123 Main St for chest pain.

=== RESPONSE ===
Unit responded without delay.

=== ARRIVAL ===
Upon arrival, found Male 65 patient with chief complaint of chest pain for 30 minutes. Patient found sitting upright in chair, clutching chest.

=== ASSESSMENT ===
Patient was AAOx4, GCS-15, PERRL. Vital signs: Patient was hypertensive, tachycardic. All other vital signs within normal limits. Full assessment performed; no DCAP-BTLS noted throughout the body.

=== TREATMENT ===
Administered 324mg aspirin PO, established IV access.

=== TRANSPORT ===
Patient transported to Memorial Hospital in position of comfort.
"""
    
    # Mock the OpenAI client
    with patch('lib.openai_client.client.chat.completions.create', 
               return_value=MockResponse(expected_narrative)):
        # Generate the narrative
        narrative = await generate_ems_narrative(form_data)
        
        # Check that the narrative matches the expected output
        assert narrative == expected_narrative
        assert "DISPATCH" in narrative
        assert "Medic 1" in narrative
        assert "chest pain" in narrative
        assert "Memorial Hospital" in narrative


@pytest.mark.asyncio
async def test_generate_fire_narrative():
    """Test generating a fire narrative."""
    # Sample form data
    form_data = {
        "unit": "Engine 3",
        "emergency_type": "Structure Fire",
        "additional_info": "Two-story residential structure with heavy smoke showing from second floor."
    }
    
    # Expected narrative
    expected_narrative = """FIRE INCIDENT REPORT

Engine 3 responded to a structure fire. Upon arrival, observed heavy smoke and flames visible from the second floor of a two-story residential structure.

Incident commander established command and ordered a defensive attack due to structural integrity concerns. Primary search was conducted in safe areas, confirming no occupants were inside the structure.

Water supply was established from a nearby hydrant. Multiple attack lines were deployed to suppress the fire. Ventilation was performed by ladder crew.

Fire was brought under control within 30 minutes. Overhaul operations revealed fire origin appeared to be in the kitchen area, possibly electrical in nature. Fire marshal was called to the scene for investigation.

No civilian or firefighter injuries reported.
"""
    
    # Mock the OpenAI client
    with patch('lib.openai_client.client.chat.completions.create', 
               return_value=MockResponse(expected_narrative)):
        # Generate the narrative
        narrative = await generate_fire_narrative(form_data)
        
        # Check that the narrative matches the expected output
        assert narrative == expected_narrative
        assert "FIRE INCIDENT REPORT" in narrative
        assert "Engine 3" in narrative
        assert "structure fire" in narrative
        assert "defensive attack" in narrative


if __name__ == "__main__":
    # Run the async tests
    loop = asyncio.get_event_loop()
    loop.run_until_complete(test_generate_ems_narrative())
    loop.run_until_complete(test_generate_fire_narrative())
    
    print("All OpenAI tests passed!")