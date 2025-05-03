"""
EZ Narratives - Reflex Web Application
======================================

This is the main entry point for the Reflex web application.
"""

import reflex as rx
from .app.states.session_state import SessionState
from .app.states.ui_state import UIState
from .app.states.ems_state import EMSState
from .app.states.fire_state import FireState

# Import pages
from .app.pages.integrated_dashboard import page as dashboard_page
from .app.pages.login import page as login_page
from .app.pages.signup import page as signup_page
from .app.pages.settings import page as settings_page

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

# Define the login page
def login() -> rx.Component:
    """The login page."""
    return rx.center(
        rx.vstack(
            rx.heading("Login", size="xl", mb=6),
            rx.input(
                placeholder="Email",
                on_change=SessionState.set_email,
                mb=4,
                width="100%",
            ),
            rx.input(
                placeholder="Password",
                type="password",
                on_change=SessionState.set_password,
                mb=6,
                width="100%",
            ),
            rx.cond(
                SessionState.auth_error,
                rx.text(
                    SessionState.auth_error,
                    color="red",
                    mb=4,
                ),
            ),
            rx.button(
                "Login",
                on_click=SessionState.login,
                is_loading=SessionState.is_loading,
                width="100%",
                color_scheme="indigo",
            ),
            rx.text(
                "Don't have an account? ",
                rx.link("Sign up", href="/signup", color="indigo"),
                mt=4,
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

# Compile the app
app.compile()