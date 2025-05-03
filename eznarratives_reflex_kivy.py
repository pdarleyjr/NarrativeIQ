"""
EZ Narratives Reflex Kivy
=========================

This is the main entry point for the EZ Narratives application.
"""

import reflex as rx
from eznarratives_reflex_kivy.app.states.session_state import SessionState
from eznarratives_reflex_kivy.app.states.ui_state import UIState
from eznarratives_reflex_kivy.app.states.ems_state import EMSState
from eznarratives_reflex_kivy.app.states.fire_state import FireState

# Import pages
from eznarratives_reflex_kivy.app.pages.integrated_dashboard import page as dashboard_page
from eznarratives_reflex_kivy.app.pages.login import page as login_page
from eznarratives_reflex_kivy.app.pages.signup import page as signup_page
from eznarratives_reflex_kivy.app.pages.settings import page as settings_page

# Define the app
app = rx.App(
    stylesheets=[
        "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    ],
)

# Define the index page
def index() -> rx.Component:
    """The main index page."""
    return rx.center(
        rx.vstack(
            rx.heading("EZ Narratives", size="2xl", mb=6),
            rx.text("EMS and Fire Narrative Generation", mb=4),
            rx.button(
                "Get Started",
                size="lg",
                color_scheme="indigo",
                on_click=rx.redirect("/login"),
            ),
            spacing="4",
            padding="8",
            border_radius="lg",
            border="1px solid #eaeaea",
            box_shadow="lg",
            width="100%",
            max_width="400px",
        ),
        height="100vh",
    )

# Add pages to the app
app.add_page(index, route="/")
app.add_page(login_page, route="/login")
app.add_page(signup_page, route="/signup")
app.add_page(settings_page, route="/settings")
app.add_page(dashboard_page, route="/dashboard")

# No need to compile the app here