"""
Signup Page for EZ Narratives
============================

This page provides the signup functionality for the application.
"""

import reflex as rx
from app.states.session_state import SessionState


def signup() -> rx.Component:
    """Create the signup page.
    
    Returns:
        The signup page component.
    """
    session_state = SessionState.get_current_state()
    
    return rx.center(
        rx.vstack(
            rx.heading("EZ Narratives", size="xl", mb="6"),
            
            rx.card(
                rx.vstack(
                    rx.heading("Create an Account", size="lg", mb="4"),
                    
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
                    
                    # Name input
                    rx.form_control(
                        rx.form_label("Full Name", html_for="name"),
                        rx.input(
                            id="name",
                            placeholder="Enter your full name",
                            value=session_state.name,
                            on_change=session_state.set_name,
                            required=True,
                        ),
                        mb="4",
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
                        mb="4",
                    ),
                    
                    # Confirm password input
                    rx.form_control(
                        rx.form_label("Confirm Password", html_for="confirm_password"),
                        rx.input(
                            id="confirm_password",
                            placeholder="Confirm your password",
                            value=session_state.confirm_password,
                            on_change=session_state.set_confirm_password,
                            type_="password",
                            required=True,
                        ),
                        mb="6",
                    ),
                    
                    # Signup button
                    rx.button(
                        "Sign Up",
                        width="100%",
                        color_scheme="blue",
                        size="lg",
                        on_click=session_state.signup,
                        is_loading=session_state.is_loading,
                        mb="4",
                    ),
                    
                    # Login link
                    rx.hstack(
                        rx.text("Already have an account?"),
                        rx.link(
                            "Log in",
                            href="/login",
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
page = signup