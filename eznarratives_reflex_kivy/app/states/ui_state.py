import reflex as rx
from typing import Optional, Dict, Any, List

class UIState(rx.State):
    """State for managing UI-related state."""
    
    # Theme state
    is_dark_mode: bool = False
    font_size: str = "Medium"
    
    # Notification settings
    email_notifications: bool = True
    push_notifications: bool = True
    
    # Settings state
    is_saving: bool = False
    
    # Responsive state
    is_mobile: bool = False
    window_width: int = 1200
    window_height: int = 800
    
    # Navigation state
    active_tab: str = "chat"  # "chat", "ems", "fire"
    
    # Sidebar state
    sidebar_visible: bool = True
    
    # Dialog state
    settings_dialog_open: bool = False
    protocol_query_dialog_open: bool = False
    custom_instructions_dialog_open: bool = False
    
    # Mobile drawer state
    mobile_narrative_drawer_open: bool = False
    mobile_sessions_drawer_open: bool = False
    
    # Quick actions state
    quick_actions_expanded: bool = False
    
    # Narrative settings
    narrative_settings: Dict[str, Any] = {
        "format_type": "D.R.A.T.T.",
        "use_abbreviations": True,
        "include_headers": True,
        "default_unit": "",
        "default_hospital": "",
        "custom_format": "",
    }
    
    @rx.event
    async def on_load(self):
        """Initialize state when the app loads."""
        # Check for dark mode preference
        self.is_dark_mode = await rx.client_side("window.matchMedia('(prefers-color-scheme: dark)').matches")
        if self.is_dark_mode:
            await rx.client_side("document.documentElement.classList.add('dark')")
        
        # Check for mobile device and get window dimensions
        self.is_mobile = await rx.client_side(
            "(window.innerWidth <= 768) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)"
        )
        self.window_width = await rx.client_side("window.innerWidth")
        self.window_height = await rx.client_side("window.innerHeight")
        
        # Set sidebar visibility based on mobile state
        if self.is_mobile:
            self.sidebar_visible = False
        
        # Load narrative settings from localStorage if available
        stored_settings = await rx.client_side(
            "JSON.parse(localStorage.getItem('narrative_settings') || '{}')"
        )
        if stored_settings:
            self.narrative_settings.update(stored_settings)
    
    @rx.event
    async def toggle_dark_mode(self):
        """Toggle dark mode."""
        self.is_dark_mode = not self.is_dark_mode
        if self.is_dark_mode:
            await rx.client_side("document.documentElement.classList.add('dark')")
        else:
            await rx.client_side("document.documentElement.classList.remove('dark')")
    
    @rx.event
    async def toggle_sidebar(self):
        """Toggle sidebar visibility."""
        self.sidebar_visible = not self.sidebar_visible
    
    @rx.event
    async def set_active_tab(self, tab: str):
        """Set the active tab."""
        self.active_tab = tab
    
    @rx.event
    async def toggle_settings_dialog(self):
        """Toggle settings dialog."""
        self.settings_dialog_open = not self.settings_dialog_open
    
    @rx.event
    async def toggle_protocol_query_dialog(self):
        """Toggle protocol query dialog."""
        self.protocol_query_dialog_open = not self.protocol_query_dialog_open
    
    @rx.event
    async def toggle_custom_instructions_dialog(self):
        """Toggle custom instructions dialog."""
        self.custom_instructions_dialog_open = not self.custom_instructions_dialog_open
    
    @rx.event
    async def toggle_mobile_narrative_drawer(self):
        """Toggle mobile narrative drawer."""
        self.mobile_narrative_drawer_open = not self.mobile_narrative_drawer_open
    
    @rx.event
    async def toggle_mobile_sessions_drawer(self):
        """Toggle mobile sessions drawer."""
        self.mobile_sessions_drawer_open = not self.mobile_sessions_drawer_open
    
    @rx.event
    async def toggle_quick_actions(self):
        """Toggle quick actions expanded state."""
        self.quick_actions_expanded = not self.quick_actions_expanded
    
    @rx.event
    async def update_narrative_settings(self, settings: Dict[str, Any]):
        """Update narrative settings."""
        self.narrative_settings.update(settings)
        
        # Save to localStorage
        await rx.client_side(
            f"localStorage.setItem('narrative_settings', JSON.stringify({self.narrative_settings}))"
        )
    
    @rx.event
    async def set_font_size(self, size: str):
        """Set the font size."""
        self.font_size = size
        # Save to localStorage
        await rx.client_side(
            f"localStorage.setItem('font_size', '{size}')"
        )
    
    @rx.event
    async def toggle_email_notifications(self):
        """Toggle email notifications."""
        self.email_notifications = not self.email_notifications
        # Save to localStorage
        await rx.client_side(
            f"localStorage.setItem('email_notifications', {str(self.email_notifications).lower()})"
        )
    
    @rx.event
    async def toggle_push_notifications(self):
        """Toggle push notifications."""
        self.push_notifications = not self.push_notifications
        # Save to localStorage
        await rx.client_side(
            f"localStorage.setItem('push_notifications', {str(self.push_notifications).lower()})"
        )
    
    @rx.event
    async def save_settings(self):
        """Save all settings."""
        self.is_saving = True
        
        # Simulate saving settings
        await rx.sleep(1)
        
        # Save all settings to localStorage
        await rx.client_side("""
            localStorage.setItem('font_size', arguments[0]);
            localStorage.setItem('email_notifications', arguments[1]);
            localStorage.setItem('push_notifications', arguments[2]);
            localStorage.setItem('is_dark_mode', arguments[3]);
        """, self.font_size, str(self.email_notifications).lower(),
            str(self.push_notifications).lower(), str(self.is_dark_mode).lower())
        
        self.is_saving = False
        return rx.window_alert("Settings saved successfully!")
    
    @rx.event
    async def handle_window_resize(self):
        """Handle window resize event."""
        self.window_width = await rx.client_side("window.innerWidth")
        self.window_height = await rx.client_side("window.innerHeight")
        
        # Update mobile state
        previous_is_mobile = self.is_mobile
        self.is_mobile = self.window_width <= 768
        
        # If transitioning from desktop to mobile, hide sidebar
        if not previous_is_mobile and self.is_mobile:
            self.sidebar_visible = False
        
        # If transitioning from mobile to desktop, show sidebar
        if previous_is_mobile and not self.is_mobile:
            self.sidebar_visible = True