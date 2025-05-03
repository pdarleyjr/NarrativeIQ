"""EZ Narratives application package."""

import reflex as rx
from app.states.session_state import SessionState
from app.states.ui_state import UIState
from app.states.ems_state import EMSState
from app.states.fire_state import FireState

# Import components
from app.components import app_tabs, chat_panel, ems_panel, fire_panel

# Import pages
from app.pages import integrated_dashboard