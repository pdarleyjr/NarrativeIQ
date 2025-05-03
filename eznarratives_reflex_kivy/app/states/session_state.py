import reflex as rx
from typing import Dict, List, Optional, Any

from lib.supabase import (
    sign_in_with_email_password,
    sign_out,
    get_current_user,
    check_admin_status
)

class Message:
    """Message model for chat sessions."""
    type: str  # 'user' or 'assistant'
    content: str
    timestamp: str

class Session:
    """Session model for user sessions."""
    id: str
    name: str
    date: str
    messages: List[Message]
    active: bool = False

class SessionState(rx.State):
    """State for managing user sessions and authentication."""
    
    # Authentication state
    user: Optional[Dict[str, Any]] = None
    is_loading: bool = False
    is_admin: bool = False
    auth_error: Optional[str] = None
    
    # Form inputs
    name: str = ""
    email: str = ""
    password: str = ""
    confirm_password: str = ""
    user_name: str = ""
    user_email: str = ""
    current_password: str = ""
    new_password: str = ""
    confirm_new_password: str = ""
    
    # Session state
    sessions: List[Session] = []
    active_session: Optional[str] = None
    
    # UI state
    is_dark_mode: bool = False
    is_mobile: bool = False
    sidebar_visible: bool = True
    
    @rx.var
    def is_authenticated(self) -> bool:
        """Check if user is authenticated."""
        return self.user is not None
    
    @rx.var
    def active_session_data(self) -> Optional[Session]:
        """Get the active session data."""
        if not self.active_session:
            return None
        
        for session in self.sessions:
            if session.id == self.active_session:
                return session
        
        return None
    
    @rx.event
    async def on_load(self):
        """Initialize state when the app loads."""
        # Check for dark mode preference
        self.is_dark_mode = await rx.client_side("window.matchMedia('(prefers-color-scheme: dark)').matches")
        
        # Check for mobile device
        self.is_mobile = await rx.client_side(
            "(window.innerWidth <= 768) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)"
        )
        
        if self.is_mobile:
            self.sidebar_visible = False
        
        # Try to get current user
        user = await get_current_user()
        if user:
            self.user = user
            self.is_admin = await check_admin_status(user.id)
            await self.load_sessions()
    
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
    async def set_email(self, email: str):
        """Set email input."""
        self.email = email
    
    @rx.event
    async def set_password(self, password: str):
        """Set password input."""
        self.password = password
    
    @rx.event
    async def set_name(self, name: str):
        """Set name input."""
        self.name = name
    
    @rx.event
    async def set_confirm_password(self, confirm_password: str):
        """Set confirm password input."""
        self.confirm_password = confirm_password
    
    @rx.event
    async def set_user_name(self, user_name: str):
        """Set user name."""
        self.user_name = user_name
    
    @rx.event
    async def set_user_email(self, user_email: str):
        """Set user email."""
        self.user_email = user_email
    
    @rx.event
    async def set_current_password(self, current_password: str):
        """Set current password."""
        self.current_password = current_password
    
    @rx.event
    async def set_new_password(self, new_password: str):
        """Set new password."""
        self.new_password = new_password
    
    @rx.event
    async def set_confirm_new_password(self, confirm_new_password: str):
        """Set confirm new password."""
        self.confirm_new_password = confirm_new_password
    
    @rx.event
    async def login(self):
        """Log in a user with email and password."""
        if not self.email or not self.password:
            self.auth_error = "Please enter both email and password."
            return
        
        self.is_loading = True
        self.auth_error = None
        
        try:
            response = await sign_in_with_email_password(self.email, self.password)
            
            if response.user:
                self.user = response.user
                self.user_email = response.user.email
                self.user_name = response.user.user_metadata.get("full_name", "")
                self.is_admin = await check_admin_status(response.user.id)
                await self.load_sessions()
                return rx.redirect("/dashboard")
            else:
                self.auth_error = "Invalid email or password."
        except Exception as e:
            self.auth_error = f"Login failed: {str(e)}"
        finally:
            self.is_loading = False
    
    @rx.event
    async def signup(self):
        """Sign up a new user."""
        if not self.name or not self.email or not self.password or not self.confirm_password:
            self.auth_error = "Please fill in all fields."
            return
        
        if self.password != self.confirm_password:
            self.auth_error = "Passwords do not match."
            return
        
        self.is_loading = True
        self.auth_error = None
        
        try:
            from lib.supabase import supabase
            
            # Sign up with Supabase
            response = await supabase.auth.sign_up({
                "email": self.email,
                "password": self.password,
                "options": {
                    "data": {
                        "full_name": self.name
                    }
                }
            })
            
            if response.user:
                self.user = response.user
                self.user_email = response.user.email
                self.user_name = self.name
                await self.load_sessions()
                return rx.redirect("/dashboard")
            else:
                self.auth_error = "Signup failed. Please try again."
        except Exception as e:
            self.auth_error = f"Signup failed: {str(e)}"
        finally:
            self.is_loading = False
    
    @rx.event
    async def update_password(self):
        """Update the user's password."""
        if not self.current_password or not self.new_password or not self.confirm_new_password:
            self.auth_error = "Please fill in all password fields."
            return
        
        if self.new_password != self.confirm_new_password:
            self.auth_error = "New passwords do not match."
            return
        
        self.is_loading = True
        self.auth_error = None
        
        try:
            from lib.supabase import supabase
            
            # Update password with Supabase
            response = await supabase.auth.update_user({
                "password": self.new_password
            })
            
            if response.user:
                # Clear password fields
                self.current_password = ""
                self.new_password = ""
                self.confirm_new_password = ""
                
                # Show success message
                self.auth_error = None
                return rx.window_alert("Password updated successfully!")
            else:
                self.auth_error = "Password update failed. Please try again."
        except Exception as e:
            self.auth_error = f"Password update failed: {str(e)}"
        finally:
            self.is_loading = False
    
    @rx.event
    async def logout(self):
        """Log out the current user."""
        self.is_loading = True
        
        try:
            success = await sign_out()
            if success:
                self.user = None
                self.is_admin = False
                self.sessions = []
                self.active_session = None
                return rx.redirect("/login")
        except Exception as e:
            print(f"Error logging out: {e}")
        finally:
            self.is_loading = False
    
    @rx.event
    async def load_sessions(self):
        """Load user sessions from database."""
        if not self.is_authenticated:
            return
        
        try:
            from lib.supabase import supabase
            
            response = await supabase.table("sessions").select("*").eq("user_id", self.user["id"]).execute()
            
            if response.data:
                self.sessions = [
                    Session(
                        id=session["id"],
                        name=session["name"],
                        date=session["date"],
                        messages=session.get("messages", []),
                        active=False
                    )
                    for session in response.data
                ]
                
                if self.sessions and not self.active_session:
                    self.active_session = self.sessions[0].id
                    self.set_active_session(self.sessions[0].id)
        except Exception as e:
            print(f"Error loading sessions: {e}")
    
    @rx.event
    async def create_new_session(self):
        """Create a new session."""
        import time
        from datetime import datetime
        
        if not self.is_authenticated:
            return
        
        session_id = f"session-{int(time.time() * 1000)}"
        date = datetime.now().strftime("%b %d, %Y")
        name = f"Session {datetime.now().strftime('%b %d, %Y %I:%M %p')}"
        
        new_session = Session(
            id=session_id,
            name=name,
            date=date,
            messages=[],
            active=True
        )
        
        # Update local state
        updated_sessions = [session.copy() for session in self.sessions]
        for session in updated_sessions:
            session.active = False
        
        updated_sessions.append(new_session)
        self.sessions = updated_sessions
        self.active_session = session_id
        
        # Save to database
        try:
            from lib.supabase import supabase
            
            await supabase.table("sessions").insert({
                "id": session_id,
                "name": name,
                "date": date,
                "user_id": self.user["id"],
                "messages": []
            }).execute()
        except Exception as e:
            print(f"Error creating new session: {e}")
    
    @rx.event
    async def set_active_session(self, session_id: str):
        """Set the active session."""
        self.active_session = session_id
        
        updated_sessions = []
        for session in self.sessions:
            updated_session = session.copy()
            updated_session.active = (session.id == session_id)
            updated_sessions.append(updated_session)
        
        self.sessions = updated_sessions
    
    @rx.event
    async def rename_session(self, session_id: str, new_name: str):
        """Rename a session."""
        if not new_name:
            return
        
        # Update local state
        updated_sessions = []
        for session in self.sessions:
            updated_session = session.copy()
            if session.id == session_id:
                updated_session.name = new_name
            updated_sessions.append(updated_session)
        
        self.sessions = updated_sessions
        
        # Update in database
        try:
            from lib.supabase import supabase
            
            await supabase.table("sessions").update({
                "name": new_name
            }).eq("id", session_id).execute()
        except Exception as e:
            print(f"Error renaming session: {e}")
    
    @rx.event
    async def delete_session(self, session_id: str):
        """Delete a session."""
        # Update local state
        updated_sessions = [session for session in self.sessions if session.id != session_id]
        self.sessions = updated_sessions
        
        # If we deleted the active session, set a new active session
        if self.active_session == session_id:
            if updated_sessions:
                self.active_session = updated_sessions[0].id
                self.set_active_session(updated_sessions[0].id)
            else:
                self.active_session = None
                await self.create_new_session()
        
        # Delete from database
        try:
            from lib.supabase import supabase
            
            await supabase.table("sessions").delete().eq("id", session_id).execute()
        except Exception as e:
            print(f"Error deleting session: {e}")
    
    @rx.event
    async def add_message_to_session(self, message_type: str, content: str, timestamp: str):
        """Add a message to the active session."""
        if not self.active_session:
            return
        
        new_message = Message(
            type=message_type,
            content=content,
            timestamp=timestamp
        )
        
        # Update local state
        updated_sessions = []
        for session in self.sessions:
            updated_session = session.copy()
            if session.id == self.active_session:
                updated_messages = session.messages.copy() if session.messages else []
                updated_messages.append(new_message)
                updated_session.messages = updated_messages
            updated_sessions.append(updated_session)
        
        self.sessions = updated_sessions
        
        # Update in database
        try:
            from lib.supabase import supabase
            
            # Get current messages
            response = await supabase.table("sessions").select("messages").eq("id", self.active_session).execute()
            current_messages = response.data[0].get("messages", []) if response.data else []
            
            # Append new message
            updated_messages = current_messages + [{
                "type": message_type,
                "content": content,
                "timestamp": timestamp
            }]
            
            # Update in database
            await supabase.table("sessions").update({
                "messages": updated_messages
            }).eq("id", self.active_session).execute()
        except Exception as e:
            print(f"Error adding message to session: {e}")