import reflex as rx
import os
import json
from typing import Dict, Any, Optional
from datetime import datetime

from lib.openai_client import generate_fire_narrative
from lib.supabase import supabase

class FireState(rx.State):
    """State for managing fire narrative form data and generation."""
    
    # Form data
    unit: str = ""
    emergency_type: str = ""
    custom_emergency_type: str = ""
    additional_info: str = ""
    
    # Generated narrative
    narrative_text: str = ""
    
    # Form state
    is_form_collapsed: bool = False
    show_custom_emergency_type: bool = False
    is_generating: bool = False
    generation_error: Optional[str] = None
    is_offline: bool = False
    narrative_id: Optional[str] = None
    
    # Emergency types list
    emergency_types: list[str] = [
        "Structure Fire", "Vehicle Fire", "Cooking Fire (Confined)", "Chimney/Flue Fire",
        "Fire in Mobile Home", "Smoke Scare", "Wildland Fire", "Brush Fire", "Grass Fire",
        "Unauthorized Burning", "Smoke Report", "Medical Call", "MVA w/ Injuries",
        "MVA No Injuries", "Extrication", "Search for Person on Land", "Search for Person in Water",
        "Gas Leak", "CO Incident", "Power Line Down", "Hazardous Materials Spill",
        "Smoke Alarm Activation", "False Alarm", "Public Assist", "Ice Rescue",
        "Water Rescue", "Animal Rescue", "Technical Rescue", "High-Angle Rescue",
        "Confined Space Rescue", "Elevator Rescue (Stuck Elevator)", "Natural Gas Leak",
        "Electrical Fire", "Outdoor Fire", "Other"
    ]
    
    @rx.var
    def form_data(self) -> Dict[str, Any]:
        """Get the complete form data."""
        return {
            "unit": self.unit,
            "emergency_type": self.emergency_type if self.emergency_type != "Other" else self.custom_emergency_type,
            "additional_info": self.additional_info,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    
    @rx.event
    async def set_unit(self, value: str):
        """Set the unit value."""
        self.unit = value
    
    @rx.event
    async def set_emergency_type(self, value: str):
        """Set the emergency type value."""
        self.emergency_type = value
        self.show_custom_emergency_type = (value == "Other")
    
    @rx.event
    async def set_custom_emergency_type(self, value: str):
        """Set the custom emergency type value."""
        self.custom_emergency_type = value
    
    @rx.event
    async def set_additional_info(self, value: str):
        """Set the additional info value."""
        self.additional_info = value
    
    @rx.event
    async def toggle_form_collapsed(self):
        """Toggle form collapsed state."""
        self.is_form_collapsed = not self.is_form_collapsed
    
    @rx.event
    async def on_load(self):
        """Initialize state when the app loads."""
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
        cache_file = os.path.join(cache_dir, f"fire_narrative_{timestamp}.json")
        
        with open(cache_file, 'w') as f:
            json.dump(narrative_data, f)
    
    async def _process_cached_narratives(self):
        """Process any cached narratives."""
        cache_dir = await self._get_cache_dir()
        if not os.path.exists(cache_dir):
            return
        
        cached_files = [f for f in os.listdir(cache_dir) if f.startswith("fire_narrative_") and f.endswith(".json")]
        
        for file_name in cached_files:
            file_path = os.path.join(cache_dir, file_name)
            try:
                with open(file_path, 'r') as f:
                    narrative_data = json.load(f)
                
                # Submit to Supabase
                await self._save_narrative_to_supabase(narrative_data)
                
                # Remove the cached file
                os.remove(file_path)
            except Exception as e:
                print(f"Error processing cached narrative {file_name}: {str(e)}")
    
    async def _save_narrative_to_supabase(self, narrative_data: Dict[str, Any]) -> str:
        """Save a narrative to Supabase."""
        from app.states.session_state import SessionState
        session_state = SessionState.get_current_state()
        
        # Add user_id if authenticated
        if session_state.user:
            narrative_data["user_id"] = session_state.user["id"]
        
        # Add narrative type
        narrative_data["type"] = "fire"
        
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
        """Generate a fire narrative based on form data."""
        if not self.unit:
            return rx.window_alert("Please enter a unit.")
        
        if not self.emergency_type:
            return rx.window_alert("Please select an emergency type.")
        
        if self.emergency_type == "Other" and not self.custom_emergency_type:
            return rx.window_alert("Please specify the emergency type.")
        
        self.is_generating = True
        self.generation_error = None
        
        try:
            # Check network status
            self.is_offline = not await self._check_network()
            
            # Format fire data for narrative generation
            emergency_type_text = self.custom_emergency_type if self.emergency_type == "Other" else self.emergency_type
            
            # Create narrative data with fire incident information
            fire_data = {
                "unit": self.unit,
                "emergency_type": emergency_type_text,
                "additional_info": self.additional_info
            }
            
            # Generate the narrative
            self.narrative_text = await generate_fire_narrative(fire_data)
            
            # Create narrative data for saving
            narrative_data = {
                "content": self.narrative_text,
                "form_data": fire_data,
                "created_at": datetime.now().isoformat(),
                "title": f"Fire Narrative - {emergency_type_text} - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
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
                self.narrative_id = await self._save_narrative_to_supabase(narrative_data)
            
            # Switch to the fire tab
            from app.states.ui_state import UIState
            ui_state = UIState.get_current_state()
            await ui_state.set_active_tab("fire")
            
            return rx.toast.success("Fire narrative generated successfully")
        except Exception as e:
            self.generation_error = str(e)
            return rx.toast.error(f"Error generating narrative: {str(e)}")
        finally:
            self.is_generating = False
    
    @rx.event
    async def reset_form(self):
        """Reset the form to default values."""
        self.unit = ""
        self.emergency_type = ""
        self.custom_emergency_type = ""
        self.additional_info = ""
        self.show_custom_emergency_type = False
    
    @rx.event
    async def prefill_form(self):
        """Prefill the form with default values."""
        # Get default unit from narrative settings
        from app.states.ui_state import UIState
        ui_state = UIState.get_current_state()
        
        self.unit = ui_state.narrative_settings.get("default_unit", "")
        self.emergency_type = "Structure Fire"
        self.custom_emergency_type = ""
        self.additional_info = "Standard fire protocols followed."
        self.show_custom_emergency_type = False