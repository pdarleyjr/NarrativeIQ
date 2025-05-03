import reflex as rx
import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import asyncio

from lib.openai_client import generate_ems_narrative
from lib.supabase import supabase

class EMSState(rx.State):
    """State for managing EMS narrative form data and generation."""
    
    # Form data - Dispatch section
    unit: str = ""
    dispatch_reason: str = ""
    response_delay: str = "No response delays"
    response_delay_custom: str = ""
    
    # Form data - Patient Information section
    patient_sex: str = ""
    patient_age: str = ""
    chief_complaint: str = ""
    duration: str = ""
    patient_presentation: str = ""
    
    # Form data - Assessment section
    aao_person: bool = True
    aao_place: bool = True
    aao_time: bool = True
    aao_event: bool = True
    is_unresponsive: bool = False
    gcs_score: str = "15"
    pupils: str = "PERRL"
    selected_pertinent_negatives: List[str] = []
    unable_to_obtain_negatives: bool = False
    vital_signs_normal: bool = True
    selected_abnormal_vitals: List[str] = []
    all_other_vitals_normal: bool = True
    dcap_btls: bool = True
    additional_assessment: str = ""
    
    # Form data - Treatment section
    treatment_provided: str = ""
    add_protocol_treatments: bool = False
    protocol_exclusions: str = ""
    
    # Form data - Transport section
    refused_transport: bool = False
    refusal_details: str = ""
    transport_destination: str = ""
    transport_position: str = "Position of comfort"
    room_number: str = ""
    nurse_name: str = ""
    unit_in_service: bool = True
    
    # Form data - Format Options section
    format_type: str = "D.R.A.T.T."
    use_abbreviations: bool = True
    include_headers: bool = True
    default_unit: str = ""
    default_hospital: str = ""
    custom_format: str = ""
    
    # UI state
    active_ems_section: str = "Dispatch"  # "Dispatch", "Arrival", "Assessment", "Treatment", "Transport"
    is_form_collapsed: bool = False
    is_generating: bool = False
    generation_error: Optional[str] = None
    is_offline: bool = False
    
    # Generated narrative
    narrative_text: str = ""
    narrative_id: Optional[str] = None
    
    # Lists for dropdowns
    response_delay_options: List[str] = [
        "No response delays", "Weather", "Traffic", "Distance", "Directions", "Custom"
    ]
    
    sex_options: List[str] = ["Male", "Female", "Other"]
    
    gcs_score_options: List[str] = [str(i) for i in range(15, 0, -1)]
    
    pupils_options: List[str] = [
        "PERRL", "PERRLA", "Unequal", "Fixed", "Dilated", "Constricted"
    ]
    
    pertinent_negatives_options: List[str] = [
        "Chest pain", "Shortness of breath", "Dizziness", "Nausea", "Vomiting",
        "Headache", "Abdominal pain", "Back pain", "Loss of consciousness",
        "Weakness", "Numbness", "Tingling", "Vision changes", "Hearing changes"
    ]
    
    abnormal_vitals_options: List[str] = [
        "Hypertensive", "Hypotensive", "Tachycardic", "Bradycardic",
        "Tachypneic", "Bradypneic", "Febrile", "Hypothermic", "Hypoxic"
    ]
    
    transport_position_options: List[str] = [
        "Position of comfort", "Supine", "Fowler's", "Semi-Fowler's",
        "Left lateral recumbent", "Right lateral recumbent", "Trendelenburg"
    ]
    
    format_type_options: List[str] = [
        "D.R.A.T.T.", "S.O.A.P.", "C.H.A.R.T.", "Custom"
    ]
    
    @rx.var
    def form_data(self) -> Dict[str, Any]:
        """Get the complete form data."""
        return {
            # Dispatch section
            "unit": self.unit,
            "dispatch_reason": self.dispatch_reason,
            "response_delay": self.response_delay,
            "response_delay_custom": self.response_delay_custom,
            
            # Patient Information section
            "patient_sex": self.patient_sex,
            "patient_age": self.patient_age,
            "chief_complaint": self.chief_complaint,
            "duration": self.duration,
            "patient_presentation": self.patient_presentation,
            
            # Assessment section
            "aao_person": self.aao_person,
            "aao_place": self.aao_place,
            "aao_time": self.aao_time,
            "aao_event": self.aao_event,
            "is_unresponsive": self.is_unresponsive,
            "gcs_score": self.gcs_score,
            "pupils": self.pupils,
            "selected_pertinent_negatives": self.selected_pertinent_negatives,
            "unable_to_obtain_negatives": self.unable_to_obtain_negatives,
            "vital_signs_normal": self.vital_signs_normal,
            "selected_abnormal_vitals": self.selected_abnormal_vitals,
            "all_other_vitals_normal": self.all_other_vitals_normal,
            "dcap_btls": self.dcap_btls,
            "additional_assessment": self.additional_assessment,
            
            # Treatment section
            "treatment_provided": self.treatment_provided,
            "add_protocol_treatments": self.add_protocol_treatments,
            "protocol_exclusions": self.protocol_exclusions,
            
            # Transport section
            "refused_transport": self.refused_transport,
            "refusal_details": self.refusal_details,
            "transport_destination": self.transport_destination,
            "transport_position": self.transport_position,
            "room_number": self.room_number,
            "nurse_name": self.nurse_name,
            "unit_in_service": self.unit_in_service,
            
            # Format Options section
            "format_type": self.format_type,
            "use_abbreviations": self.use_abbreviations,
            "include_headers": self.include_headers,
            "default_unit": self.default_unit,
            "default_hospital": self.default_hospital,
            "custom_format": self.custom_format,
            
            # Timestamp
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    
    @rx.event
    async def on_load(self):
        """Initialize state when the app loads."""
        # Load settings from UI state
        from app.states.ui_state import UIState
        ui_state = UIState.get_current_state()
        
        self.format_type = ui_state.narrative_settings.get("format_type", "D.R.A.T.T.")
        self.use_abbreviations = ui_state.narrative_settings.get("use_abbreviations", True)
        self.include_headers = ui_state.narrative_settings.get("include_headers", True)
        self.default_unit = ui_state.narrative_settings.get("default_unit", "")
        self.default_hospital = ui_state.narrative_settings.get("default_hospital", "")
        self.custom_format = ui_state.narrative_settings.get("custom_format", "")
        
        # Set default unit
        if self.default_unit:
            self.unit = self.default_unit
        
        # Set default hospital
        if self.default_hospital:
            self.transport_destination = self.default_hospital
            
        # Check network status
        self.is_offline = not await self._check_network()
        
        # Process any cached narratives if we're back online
        if not self.is_offline:
            await self._process_cached_narratives()
    
    async def _check_network(self) -> bool:
        """Check if we have network connectivity by pinging Supabase."""
        try:
            # Try a simple query to check connectivity
            await supabase.from_("narratives").select("count", count="exact").limit(1).execute()
            return True
        except Exception:
            return False
    
    async def _get_cache_dir(self) -> str:
        """Get the cache directory path."""
        try:
            # Try to use plyer for mobile platforms
            from plyer import storagepath
            cache_dir = os.path.join(storagepath.get_documents_dir(), 'eznarratives_cache')
        except ImportError:
            # Fall back to a local directory for desktop
            cache_dir = os.path.join(os.path.expanduser('~'), '.eznarratives_cache')
        
        # Create the directory if it doesn't exist
        os.makedirs(cache_dir, exist_ok=True)
        return cache_dir
    
    async def _cache_narrative(self, narrative_data: Dict[str, Any]):
        """Cache a narrative for later submission when online."""
        cache_dir = await self._get_cache_dir()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        cache_file = os.path.join(cache_dir, f"ems_narrative_{timestamp}.json")
        
        with open(cache_file, 'w') as f:
            json.dump(narrative_data, f)
    
    async def _process_cached_narratives(self):
        """Process any cached narratives."""
        cache_dir = await self._get_cache_dir()
        if not os.path.exists(cache_dir):
            return
        
        cached_files = [f for f in os.listdir(cache_dir) if f.startswith("ems_narrative_") and f.endswith(".json")]
        
        for file_name in cached_files:
            file_path = os.path.join(cache_dir, file_name)
            try:
                with open(file_path, 'r') as f:
                    narrative_data = json.load(f)
                
                # Submit to Supabase
                await self.save_narrative_to_supabase(narrative_data)
                
                # Remove the cached file
                os.remove(file_path)
            except Exception as e:
                print(f"Error processing cached narrative {file_name}: {str(e)}")
    
    @rx.event
    async def set_active_section(self, section: str):
        """Set the active EMS form section."""
        self.active_ems_section = section
    
    @rx.event
    async def toggle_form_collapsed(self):
        """Toggle form collapsed state."""
        self.is_form_collapsed = not self.is_form_collapsed
    
    # Form field setters
    
    # Dispatch section
    @rx.event
    async def set_unit(self, value: str):
        """Set the unit value."""
        self.unit = value
    
    @rx.event
    async def set_dispatch_reason(self, value: str):
        """Set the dispatch reason value."""
        self.dispatch_reason = value
    
    @rx.event
    async def set_response_delay(self, value: str):
        """Set the response delay value."""
        self.response_delay = value
    
    @rx.event
    async def set_response_delay_custom(self, value: str):
        """Set the custom response delay value."""
        self.response_delay_custom = value
    
    # Patient Information section
    @rx.event
    async def set_patient_sex(self, value: str):
        """Set the patient sex value."""
        self.patient_sex = value
    
    @rx.event
    async def set_patient_age(self, value: str):
        """Set the patient age value."""
        self.patient_age = value
    
    @rx.event
    async def set_chief_complaint(self, value: str):
        """Set the chief complaint value."""
        self.chief_complaint = value
    
    @rx.event
    async def set_duration(self, value: str):
        """Set the duration value."""
        self.duration = value
    
    @rx.event
    async def set_patient_presentation(self, value: str):
        """Set the patient presentation value."""
        self.patient_presentation = value
    
    # Assessment section
    @rx.event
    async def toggle_aao_person(self):
        """Toggle the AAO person value."""
        self.aao_person = not self.aao_person
    
    @rx.event
    async def toggle_aao_place(self):
        """Toggle the AAO place value."""
        self.aao_place = not self.aao_place
    
    @rx.event
    async def toggle_aao_time(self):
        """Toggle the AAO time value."""
        self.aao_time = not self.aao_time
    
    @rx.event
    async def toggle_aao_event(self):
        """Toggle the AAO event value."""
        self.aao_event = not self.aao_event
    
    @rx.event
    async def toggle_is_unresponsive(self):
        """Toggle the is unresponsive value."""
        self.is_unresponsive = not self.is_unresponsive
    
    @rx.event
    async def set_gcs_score(self, value: str):
        """Set the GCS score value."""
        self.gcs_score = value
    
    @rx.event
    async def set_pupils(self, value: str):
        """Set the pupils value."""
        self.pupils = value
    
    @rx.event
    async def toggle_pertinent_negative(self, value: str):
        """Toggle a pertinent negative value."""
        if value in self.selected_pertinent_negatives:
            self.selected_pertinent_negatives.remove(value)
        else:
            self.selected_pertinent_negatives.append(value)
    
    @rx.event
    async def toggle_unable_to_obtain_negatives(self):
        """Toggle the unable to obtain negatives value."""
        self.unable_to_obtain_negatives = not self.unable_to_obtain_negatives
    
    @rx.event
    async def toggle_vital_signs_normal(self):
        """Toggle the vital signs normal value."""
        self.vital_signs_normal = not self.vital_signs_normal
    
    @rx.event
    async def toggle_abnormal_vital(self, value: str):
        """Toggle an abnormal vital value."""
        if value in self.selected_abnormal_vitals:
            self.selected_abnormal_vitals.remove(value)
        else:
            self.selected_abnormal_vitals.append(value)
    
    @rx.event
    async def toggle_all_other_vitals_normal(self):
        """Toggle the all other vitals normal value."""
        self.all_other_vitals_normal = not self.all_other_vitals_normal
    
    @rx.event
    async def toggle_dcap_btls(self):
        """Toggle the DCAP-BTLS value."""
        self.dcap_btls = not self.dcap_btls
    
    @rx.event
    async def set_additional_assessment(self, value: str):
        """Set the additional assessment value."""
        self.additional_assessment = value
    
    # Treatment section
    @rx.event
    async def set_treatment_provided(self, value: str):
        """Set the treatment provided value."""
        self.treatment_provided = value
    
    @rx.event
    async def toggle_add_protocol_treatments(self):
        """Toggle the add protocol treatments value."""
        self.add_protocol_treatments = not self.add_protocol_treatments
    
    @rx.event
    async def set_protocol_exclusions(self, value: str):
        """Set the protocol exclusions value."""
        self.protocol_exclusions = value
    
    # Transport section
    @rx.event
    async def toggle_refused_transport(self):
        """Toggle the refused transport value."""
        self.refused_transport = not self.refused_transport
    
    @rx.event
    async def set_refusal_details(self, value: str):
        """Set the refusal details value."""
        self.refusal_details = value
    
    @rx.event
    async def set_transport_destination(self, value: str):
        """Set the transport destination value."""
        self.transport_destination = value
    
    @rx.event
    async def set_transport_position(self, value: str):
        """Set the transport position value."""
        self.transport_position = value
    
    @rx.event
    async def set_room_number(self, value: str):
        """Set the room number value."""
        self.room_number = value
    
    @rx.event
    async def set_nurse_name(self, value: str):
        """Set the nurse name value."""
        self.nurse_name = value
    
    @rx.event
    async def toggle_unit_in_service(self):
        """Toggle the unit in service value."""
        self.unit_in_service = not self.unit_in_service
    
    # Format Options section
    @rx.event
    async def set_format_type(self, value: str):
        """Set the format type value."""
        self.format_type = value
    
    @rx.event
    async def toggle_use_abbreviations(self):
        """Toggle the use abbreviations value."""
        self.use_abbreviations = not self.use_abbreviations
    
    @rx.event
    async def toggle_include_headers(self):
        """Toggle the include headers value."""
        self.include_headers = not self.include_headers
    
    @rx.event
    async def set_custom_format(self, value: str):
        """Set the custom format value."""
        self.custom_format = value
    
    @rx.event
    async def update_settings(self):
        """Update the narrative settings in UI state."""
        from app.states.ui_state import UIState
        ui_state = UIState.get_current_state()
        
        settings = {
            "format_type": self.format_type,
            "use_abbreviations": self.use_abbreviations,
            "include_headers": self.include_headers,
            "default_unit": self.default_unit,
            "default_hospital": self.default_hospital,
            "custom_format": self.custom_format
        }
        
        await ui_state.update_narrative_settings(settings)
        return rx.toast.success("Settings updated")
    
    @rx.event
    async def save_narrative_to_supabase(self, narrative_data: Dict[str, Any]) -> str:
        """Save a narrative to Supabase."""
        from app.states.session_state import SessionState
        session_state = SessionState.get_current_state()
        
        # Add user_id if authenticated
        if session_state.user:
            narrative_data["user_id"] = session_state.user["id"]
        
        # Add narrative type
        narrative_data["type"] = "ems"
        
        try:
            # Insert into Supabase
            response = await supabase.from_("narratives").insert(narrative_data).execute()
            
            if response.data:
                return response.data[0]["id"]
            return ""
        except Exception as e:
            print(f"Error saving narrative to Supabase: {str(e)}")
            return ""
    
    @rx.event
    async def generate_narrative(self):
        """Generate an EMS narrative based on form data."""
        if not self.unit:
            return rx.window_alert("Please enter a unit.")
        
        if not self.dispatch_reason:
            return rx.window_alert("Please enter a dispatch reason.")
        
        if not self.patient_sex:
            return rx.window_alert("Please select a patient sex.")
        
        if not self.patient_age:
            return rx.window_alert("Please enter a patient age.")
        
        if not self.chief_complaint:
            return rx.window_alert("Please enter a chief complaint.")
        
        self.is_generating = True
        self.generation_error = None
        
        try:
            # Check network status
            self.is_offline = not await self._check_network()
            
            # Generate the narrative
            self.narrative_text = await generate_ems_narrative(self.form_data)
            
            # Create narrative data for saving
            narrative_data = {
                "content": self.narrative_text,
                "form_data": self.form_data,
                "created_at": datetime.now().isoformat(),
                "title": f"EMS Narrative - {self.chief_complaint} - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            }
            
            # Add the narrative to the session
            from app.states.session_state import SessionState
            session_state = SessionState.get_current_state()
            
            timestamp = datetime.now().strftime("%I:%M %p")
            await session_state.add_message_to_session(
                message_type="assistant",
                content=self.narrative_text,
                timestamp=timestamp
            )
            
            # Save to Supabase or cache if offline
            if self.is_offline:
                await self._cache_narrative(narrative_data)
                rx.toast.info("You are offline. Narrative saved locally and will be uploaded when connection is restored.")
            else:
                self.narrative_id = await self.save_narrative_to_supabase(narrative_data)
            
            # Switch to the EMS tab
            from app.states.ui_state import UIState
            ui_state = UIState.get_current_state()
            await ui_state.set_active_tab("ems")
            
            return rx.toast.success("EMS narrative generated successfully")
        except Exception as e:
            self.generation_error = str(e)
            return rx.toast.error(f"Error generating narrative: {str(e)}")
        finally:
            self.is_generating = False
    @rx.event
    async def reset_form(self):
        """Reset the form to default values."""
        # Keep settings
        format_type = self.format_type
        use_abbreviations = self.use_abbreviations
        include_headers = self.include_headers
        default_unit = self.default_unit
        default_hospital = self.default_hospital
        custom_format = self.custom_format
        
        # Reset all fields
        self.unit = default_unit
        self.dispatch_reason = ""
        self.response_delay = "No response delays"
        self.response_delay_custom = ""
        self.patient_sex = ""
        self.patient_age = ""
        self.chief_complaint = ""
        self.duration = ""
        self.patient_presentation = ""
        self.aao_person = True
        self.aao_place = True
        self.aao_time = True
        self.aao_event = True
        self.is_unresponsive = False
        self.gcs_score = "15"
        self.pupils = "PERRL"
        self.selected_pertinent_negatives = []
        self.unable_to_obtain_negatives = False
        self.vital_signs_normal = True
        self.selected_abnormal_vitals = []
        self.all_other_vitals_normal = True
        self.dcap_btls = True
        self.additional_assessment = ""
        self.treatment_provided = ""
        self.add_protocol_treatments = False
        self.protocol_exclusions = ""
        self.refused_transport = False
        self.refusal_details = ""
        self.transport_destination = default_hospital
        self.transport_position = "Position of comfort"
        self.room_number = ""
        self.nurse_name = ""
        self.unit_in_service = True
        self.format_type = format_type
        self.use_abbreviations = use_abbreviations
        self.include_headers = include_headers
        self.custom_format = custom_format
        
        # Reset active section
        self.active_ems_section = "Dispatch"
    
    @rx.event
    async def prefill_form(self):
        """Prefill the form with sample values."""
        # Get default unit and hospital from settings
        from app.states.ui_state import UIState
        ui_state = UIState.get_current_state()
        
        default_unit = ui_state.narrative_settings.get("default_unit", "")
        default_hospital = ui_state.narrative_settings.get("default_hospital", "")
        
        # Prefill with sample values
        self.unit = default_unit or "Medic 1"
        self.dispatch_reason = "123 Main St for chest pain"
        self.response_delay = "No response delays"
        self.response_delay_custom = ""
        self.patient_sex = "Male"
        self.patient_age = "65"
        self.chief_complaint = "Chest pain"
        self.duration = "30 minutes"
        self.patient_presentation = "Patient found sitting upright in chair, clutching chest, appears anxious and diaphoretic."
        self.aao_person = True
        self.aao_place = True
        self.aao_time = True
        self.aao_event = True
        self.is_unresponsive = False
        self.gcs_score = "15"
        self.pupils = "PERRL"
        self.selected_pertinent_negatives = ["Shortness of breath", "Nausea"]
        self.unable_to_obtain_negatives = False
        self.vital_signs_normal = False
        self.selected_abnormal_vitals = ["Hypertensive", "Tachycardic"]
        self.all_other_vitals_normal = True
        self.dcap_btls = True
        self.additional_assessment = "12-lead ECG shows ST elevation in leads II, III, aVF."
        self.treatment_provided = "Administered 324mg aspirin PO, established IV access, administered 0.4mg nitroglycerin SL with relief of pain."
        self.add_protocol_treatments = True
        self.protocol_exclusions = "None"
        self.refused_transport = False
        self.refusal_details = ""
        self.transport_destination = default_hospital or "Memorial Hospital"
        self.transport_position = "Position of comfort"
        self.room_number = "4"
        self.nurse_name = "Johnson"
        self.unit_in_service = True