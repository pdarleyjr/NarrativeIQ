"""
Login Page for EZ Narratives
===========================

This page provides the login functionality for the application.
"""

import reflex as rx
from app.states.session_state import SessionState


def login() -> rx.Component:
    """Create the login page.
    
    Returns:
        The login page component.
    """
    session_state = SessionState.get_current_state()
    
    return rx.center(
        rx.vstack(
            rx.heading("EZ Narratives", size="xl", mb="6"),
            
            rx.card(
                rx.vstack(
                    rx.heading("Login", size="lg", mb="4"),
                    
                    # Error message
                    rx.cond(
                        session_state.auth_error,
                        rx.alert(
                            rx.alert_icon(),
                            rx.alert_title(session_state.auth_error),
                            status="error",
                            mb="4",
                        ),
                    ),
                    
                    # Email input
                    rx.form_control(
                        rx.form_label("Email", html_for="email"),
                        rx.input(
                            id="email",
                            placeholder="Enter your email",
                            value=session_state.email,
                            on_change=session_state.set_email,
                            type_="email",
                            required=True,
                        ),
                        mb="4",
                    ),
                    
                    # Password input
                    rx.form_control(
                        rx.form_label("Password", html_for="password"),
                        rx.input(
                            id="password",
                            placeholder="Enter your password",
                            value=session_state.password,
                            on_change=session_state.set_password,
                            type_="password",
                            required=True,
                        ),
                        mb="6",
                    ),
                    
                    # Login button
                    rx.button(
                        "Login",
                        width="100%",
                        color_scheme="blue",
                        size="lg",
                        on_click=session_state.login,
                        is_loading=session_state.is_loading,
                        mb="4",
                    ),
                    
                    # Signup link
                    rx.hstack(
                        rx.text("Don't have an account?"),
                        rx.link(
                            "Sign up",
                            href="/signup",
                            color="blue.500",
                            font_weight="medium",
                        ),
                        justify="center",
                        mt="2",
                    ),
                    
                    width="100%",
                    spacing="4",
                ),
                width="400px",
                p="6",
            ),
            
            width="100%",
            max_width="400px",
            spacing="6",
            p="4",
        ),
        height="100vh",
    )


# Export the page
page = login