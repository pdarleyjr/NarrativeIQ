"""
EZ Narratives - Kivy Mobile Application
=======================================

This is the main entry point for the Kivy mobile application.
It sets up the Kivy app and integrates with the Reflex backend.
"""

import os
import sys
from pathlib import Path

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Kivy imports
from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen, SlideTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.core.window import Window
from kivy.metrics import dp
from kivy.utils import platform
from kivy.clock import Clock
from kivy.properties import StringProperty, ObjectProperty, BooleanProperty, ListProperty
from kivy.lang import Builder

# KivyMD imports
from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.button import MDButton, MDButtonIcon
from kivymd.uix.textfield import MDTextField
from kivymd.uix.card import MDCard
from kivymd.uix.tab import MDTabsPrimary
from kivymd.uix.list import MDList, MDListItem, MDListItemLeadingIcon, MDListItemHeadlineText
from kivymd.uix.dialog import MDDialog
from kivymd.uix.menu import MDDropdownMenu
from kivymd.uix.selectioncontrol import MDSwitch
from kivymd.uix.appbar import MDTopAppBar
from kivymd.uix.snackbar import MDSnackbar, MDSnackbarText

# Load environment variables
from dotenv import load_dotenv
load_dotenv(".env.local")

# Import our modules
from lib.supabase import (
    supabase,
    is_supabase_configured,
    sign_in_with_email_password,
    sign_out
)

from lib.openai_client import (
    generate_ems_narrative,
    generate_fire_narrative
)

# Load the KV file
Builder.load_file('main.kv')
# Define Tab class for MDTabsPrimary
class Tab(BoxLayout):
    """Class implementing content for a tab."""
    pass
    pass

# Define MessageCard class for chat messages
class MessageCard(MDCard):
    """Card for displaying chat messages."""
    content = StringProperty("")
    sender = StringProperty("")
    timestamp = StringProperty("")

# Define LoginScreen
class LoginScreen(MDScreen):
    """Login screen for the app."""
    
    def login(self):
        """Handle login button press."""
        email = self.ids.email.text
        password = self.ids.password.text
        
        if not email or not password:
            MDSnackbar(
                MDSnackbarText(text="Please enter both email and password")
            ).open()
            return
        
        # Show loading indicator
        app = MDApp.get_running_app()
        app.show_loading("Logging in...")
        
        # Perform login (this would be async in a real app)
        Clock.schedule_once(lambda dt: self._perform_login(email, password), 0.5)
    
    def _perform_login(self, email, password):
        """Perform the actual login."""
        try:
            # This would be async in a real app
            # response = await sign_in_with_email_password(email, password)
            
            # For now, just simulate a successful login
            app = MDApp.get_running_app()
            app.hide_loading()
            app.root.current = 'dashboard'
        except Exception as e:
            app = MDApp.get_running_app()
            app.hide_loading()
            MDSnackbar(
                MDSnackbarText(text=f"Login failed: {str(e)}")
            ).open()

# Define SignupScreen
class SignupScreen(MDScreen):
    """Signup screen for the app."""
    
    def signup(self):
        """Handle signup button press."""
        name = self.ids.name.text
        email = self.ids.email.text
        password = self.ids.password.text
        confirm_password = self.ids.confirm_password.text
        
        if not name or not email or not password or not confirm_password:
            MDSnackbar(
                MDSnackbarText(text="Please fill in all fields")
            ).open()
            return
        
        if password != confirm_password:
            MDSnackbar(
                MDSnackbarText(text="Passwords do not match")
            ).open()
            return
        
        # Show loading indicator
        app = MDApp.get_running_app()
        app.show_loading("Creating account...")
        
        # Perform signup (this would be async in a real app)
        Clock.schedule_once(lambda dt: self._perform_signup(name, email, password), 0.5)
    
    def _perform_signup(self, name, email, password):
        """Perform the actual signup."""
        try:
            # This would be async in a real app
            # response = await supabase.auth.sign_up({
            #     "email": email,
            #     "password": password,
            #     "options": {
            #         "data": {
            #             "full_name": name
            #         }
            #     }
            # })
            
            # For now, just simulate a successful signup
            app = MDApp.get_running_app()
            app.hide_loading()
            MDSnackbar(
                MDSnackbarText(text="Account created successfully! Please log in.")
            ).open()
            app.root.current = 'login'
        except Exception as e:
            app = MDApp.get_running_app()
            app.hide_loading()
            MDSnackbar(
                MDSnackbarText(text=f"Signup failed: {str(e)}")
            ).open()

# Define SettingsScreen
class SettingsScreen(MDScreen):
    """Settings screen for the app."""
    
    def on_enter(self):
        """Called when the screen is entered."""
        # Populate fields with user data
        app = MDApp.get_running_app()
        # In a real app, this would be populated with actual user data
        self.ids.user_name.text = "John Doe"
        self.ids.user_email.text = "john.doe@example.com"
        
        # Set switches based on settings
        self.ids.theme_switch.active = app.theme_cls.theme_style == "Dark"
        self.ids.font_size_spinner.text = "Medium"  # Default
        self.ids.email_notifications_switch.active = True  # Default
        self.ids.push_notifications_switch.active = True  # Default
    
    def back_to_dashboard(self):
        """Navigate back to the dashboard."""
        self.manager.current = 'dashboard'
    
    def update_password(self):
        """Update the user's password."""
        current_password = self.ids.current_password.text
        new_password = self.ids.new_password.text
        confirm_new_password = self.ids.confirm_new_password.text
        
        if not current_password or not new_password or not confirm_new_password:
            MDSnackbar(
                MDSnackbarText(text="Please fill in all password fields")
            ).open()
            return
        
        if new_password != confirm_new_password:
            MDSnackbar(
                MDSnackbarText(text="New passwords do not match")
            ).open()
            return
        
        # Show loading indicator
        app = MDApp.get_running_app()
        app.show_loading("Updating password...")
        
        # Perform password update (this would be async in a real app)
        Clock.schedule_once(lambda dt: self._perform_password_update(current_password, new_password), 0.5)
    
    def _perform_password_update(self, current_password, new_password):
        """Perform the actual password update."""
        try:
            # This would be async in a real app
            # response = await supabase.auth.update_user({
            #     "password": new_password
            # })
            
            # For now, just simulate a successful update
            app = MDApp.get_running_app()
            app.hide_loading()
            
            # Clear password fields
            self.ids.current_password.text = ""
            self.ids.new_password.text = ""
            self.ids.confirm_new_password.text = ""
            
            MDSnackbar(
                MDSnackbarText(text="Password updated successfully")
            ).open()
        except Exception as e:
            app = MDApp.get_running_app()
            app.hide_loading()
            MDSnackbar(
                MDSnackbarText(text=f"Password update failed: {str(e)}")
            ).open()
    
    def save_settings(self):
        """Save all settings."""
        # Show loading indicator
        app = MDApp.get_running_app()
        app.show_loading("Saving settings...")
        
        # Perform settings save (this would be async in a real app)
        Clock.schedule_once(lambda dt: self._perform_save_settings(), 0.5)
    
    def _perform_save_settings(self):
        """Perform the actual settings save."""
        try:
            # This would be async in a real app and would save to a database
            # For now, just simulate a successful save
            app = MDApp.get_running_app()
            app.hide_loading()
            MDSnackbar(
                MDSnackbarText(text="Settings saved successfully")
            ).open()
        except Exception as e:
            app = MDApp.get_running_app()
            app.hide_loading()
            MDSnackbar(
                MDSnackbarText(text=f"Settings save failed: {str(e)}")
            ).open()

# Define DashboardScreen
class DashboardScreen(MDScreen):
    """Main dashboard screen with tabs."""
    
    def on_enter(self):
        """Called when the screen is entered."""
        # Initialize tabs
        pass
    
    def on_tab_switch(self, instance_tabs, instance_tab, instance_tab_label, tab_text):
        """Called when switching tabs."""
        pass
    
    def send_message(self):
        """Send a chat message."""
        message_text = self.ids.chat_input.text
        if not message_text:
            return
        
        # Clear input
        self.ids.chat_input.text = ""
        
        # Add user message to chat
        self._add_message_to_chat("You", message_text, "just now")
        
        # Simulate AI response
        Clock.schedule_once(lambda dt: self._add_ai_response(message_text), 1)
    
    def _add_message_to_chat(self, sender, content, timestamp):
        """Add a message to the chat."""
        message_card = MessageCard(
            content=content,
            sender=sender,
            timestamp=timestamp
        )
        
        if sender == "You":
            message_card.md_bg_color = [0.9, 0.9, 1, 1]  # Light blue for user
        else:
            message_card.md_bg_color = [1, 1, 1, 1]  # White for AI
        
        self.ids.chat_messages.add_widget(message_card)
        
        # Scroll to bottom
        Clock.schedule_once(lambda dt: self._scroll_to_bottom(), 0.1)
    
    def _scroll_to_bottom(self):
        """Scroll the chat to the bottom."""
        self.ids.chat_scroll.scroll_y = 0
    
    def _add_ai_response(self, user_message):
        """Add an AI response to the chat."""
        # In a real app, this would call the OpenAI API
        response = f"I received your message: '{user_message}'. How can I help with your EMS narrative?"
        self._add_message_to_chat("EZ Narratives AI", response, "just now")
    
    def generate_ems_narrative(self):
        """Generate an EMS narrative."""
        # In a real app, this would gather form data and call the OpenAI API
        MDSnackbar(
            MDSnackbarText(text="Generating EMS narrative...")
        ).open()
        
        # Simulate narrative generation
        Clock.schedule_once(self._simulate_ems_narrative, 2)
    
    def _simulate_ems_narrative(self, dt):
        """Simulate EMS narrative generation."""
        narrative = """EMS NARRATIVE REPORT

=== DISPATCH ===
Medic 1 dispatched to 123 Main St for a medical emergency.

=== RESPONSE ===
Unit responded without delay.

=== ARRIVAL ===
Upon arrival, found Male 65 patient with chief complaint of chest pain for 30 minutes. Patient found sitting upright in chair, clutching chest, appears anxious and diaphoretic.

=== ASSESSMENT ===
Patient was AAOx4, GCS-15, PERRL. Patient denied: shortness of breath, nausea. Vital signs: Patient was hypertensive, tachycardic. All other vital signs within normal limits. Full assessment performed; no DCAP-BTLS noted throughout the body. 12-lead ECG shows ST elevation in leads II, III, aVF.

=== TREATMENT ===
Administered 324mg aspirin PO, established IV access, administered 0.4mg nitroglycerin SL with relief of pain.

Additional treatments per protocol administered.

=== TRANSPORT ===
Patient transported to Memorial Hospital in position of comfort. Patient monitored en route with vitals reassessed. Patient left in Room #4 and care transferred to RN Johnson.

Medic 1 returned to service."""
        
        # Update the narrative text
        self.ids.narrative_text.text = narrative
        
        # Add to chat
        timestamp = "just now"
        self._add_message_to_chat("EZ Narratives AI", narrative, timestamp)
        
        MDSnackbar(
            MDSnackbarText(text="Narrative generated successfully")
        ).open()
    
    def generate_fire_narrative(self):
        """Generate a fire narrative."""
        # In a real app, this would gather form data and call the OpenAI API
        MDSnackbar(
            MDSnackbarText(text="Generating fire narrative...")
        ).open()
        
        # Simulate narrative generation
        Clock.schedule_once(self._simulate_fire_narrative, 2)
    
    def _simulate_fire_narrative(self, dt):
        """Simulate fire narrative generation."""
        narrative = """FIRE INCIDENT REPORT

Engine 3 responded to a structure fire at 456 Oak Street. Upon arrival, observed heavy smoke and flames visible from the second floor of a two-story residential structure.

Incident commander established command and ordered a defensive attack due to structural integrity concerns. Primary search was conducted in safe areas, confirming no occupants were inside the structure.

Water supply was established from a nearby hydrant. Multiple attack lines were deployed to suppress the fire. Ventilation was performed by ladder crew.

Fire was brought under control within 30 minutes. Overhaul operations revealed fire origin appeared to be in the kitchen area, possibly electrical in nature. Fire marshal was called to the scene for investigation.

No civilian or firefighter injuries reported. Red Cross was contacted to assist the displaced family of four.

Engine 3 returned to service after equipment was cleaned and restocked."""
        
        # Update the narrative text
        self.ids.fire_narrative_text.text = narrative
        
        # Add to chat
        timestamp = "just now"
        self._add_message_to_chat("EZ Narratives AI", narrative, timestamp)
        
        MDSnackbar(
            MDSnackbarText(text="Fire narrative generated successfully")
        ).open()

# Define the main app class
class EZNarrativesApp(MDApp):
    """Main application class."""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Initialize state references
        self.session_state = None
        self.ui_state = None
        self.ems_state = None
        self.fire_state = None
    
    def build(self):
        """Build the application."""
        self.theme_cls.primary_palette = "Indigo"
        self.theme_cls.accent_palette = "Blue"
        self.theme_cls.theme_style = "Light"
        
        # Create the screen manager
        sm = ScreenManager(transition=SlideTransition())
        sm.add_widget(LoginScreen())
        sm.add_widget(SignupScreen())
        sm.add_widget(DashboardScreen())
        sm.add_widget(SettingsScreen())
        
        return sm
    
    def toggle_theme(self):
        """Toggle between light and dark theme."""
        self.theme_cls.theme_style = "Dark" if self.theme_cls.theme_style == "Light" else "Light"
    
    def toggle_nav_drawer(self):
        """Toggle the navigation drawer."""
        # This would be implemented with a NavigationDrawer in a real app
        MDSnackbar(
            MDSnackbarText(text="Navigation drawer not implemented yet")
        ).open()
    
    def open_settings(self):
        """Open the settings dialog."""
        MDSnackbar(
            MDSnackbarText(text="Settings not implemented yet")
        ).open()
    
    def show_loading(self, text="Loading..."):
        """Show a loading dialog."""
        # This would show a loading dialog in a real app
        MDSnackbar(
            MDSnackbarText(text=text)
        ).open()
    
    def hide_loading(self):
        """Hide the loading dialog."""
        # This would hide the loading dialog in a real app
        pass

# Run the app
if __name__ == "__main__":
    EZNarrativesApp().run()