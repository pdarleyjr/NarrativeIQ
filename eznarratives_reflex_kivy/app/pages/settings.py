"""
Settings Page for EZ Narratives
=============================

This page provides the settings functionality for the application.
"""

import reflex as rx
from app.states.session_state import SessionState
from app.states.ui_state import UIState


def settings() -> rx.Component:
    """Create the settings page.
    
    Returns:
        The settings page component.
    """
    session_state = SessionState.get_current_state()
    ui_state = UIState.get_current_state()
    
    return rx.flex(
        # Main content
        rx.box(
            rx.vstack(
                rx.heading("Settings", size="lg", mb="6"),
                
                # Account Settings
                rx.card(
                    rx.vstack(
                        rx.heading("Account Settings", size="md", mb="4"),
                        
                        # Profile information
                        rx.form_control(
                            rx.form_label("Full Name"),
                            rx.input(
                                value=session_state.user_name if session_state.user else "",
                                placeholder="Your full name",
                                on_change=session_state.set_user_name,
                            ),
                            mb="4",
                        ),
                        
                        rx.form_control(
                            rx.form_label("Email"),
                            rx.input(
                                value=session_state.user_email if session_state.user else "",
                                placeholder="Your email",
                                is_disabled=True,
                            ),
                            mb="4",
                        ),
                        
                        # Change password
                        rx.heading("Change Password", size="sm", mt="4", mb="2"),
                        
                        rx.form_control(
                            rx.form_label("Current Password"),
                            rx.input(
                                type_="password",
                                placeholder="Enter current password",
                                value=session_state.current_password,
                                on_change=session_state.set_current_password,
                            ),
                            mb="3",
                        ),
                        
                        rx.form_control(
                            rx.form_label("New Password"),
                            rx.input(
                                type_="password",
                                placeholder="Enter new password",
                                value=session_state.new_password,
                                on_change=session_state.set_new_password,
                            ),
                            mb="3",
                        ),
                        
                        rx.form_control(
                            rx.form_label("Confirm New Password"),
                            rx.input(
                                type_="password",
                                placeholder="Confirm new password",
                                value=session_state.confirm_new_password,
                                on_change=session_state.set_confirm_new_password,
                            ),
                            mb="4",
                        ),
                        
                        rx.button(
                            "Update Password",
                            on_click=session_state.update_password,
                            is_loading=session_state.is_loading,
                            color_scheme="blue",
                        ),
                        
                        width="100%",
                        align_items="start",
                        spacing="3",
                    ),
                    mb="6",
                ),
                
                # Appearance Settings
                rx.card(
                    rx.vstack(
                        rx.heading("Appearance", size="md", mb="4"),
                        
                        # Theme toggle
                        rx.hstack(
                            rx.text("Theme:"),
                            rx.spacer(),
                            rx.switch(
                                is_checked=ui_state.is_dark_mode,
                                on_change=ui_state.toggle_dark_mode,
                            ),
                            rx.text(
                                rx.cond(
                                    ui_state.is_dark_mode,
                                    "Dark",
                                    "Light",
                                )
                            ),
                            width="100%",
                        ),
                        
                        # Font size
                        rx.hstack(
                            rx.text("Font Size:"),
                            rx.spacer(),
                            rx.select(
                                ["Small", "Medium", "Large"],
                                value=ui_state.font_size,
                                on_change=ui_state.set_font_size,
                                width="120px",
                            ),
                            width="100%",
                            mt="4",
                        ),
                        
                        width="100%",
                        align_items="start",
                        spacing="3",
                    ),
                    mb="6",
                ),
                
                # Notification Settings
                rx.card(
                    rx.vstack(
                        rx.heading("Notifications", size="md", mb="4"),
                        
                        rx.hstack(
                            rx.text("Email Notifications:"),
                            rx.spacer(),
                            rx.switch(
                                is_checked=ui_state.email_notifications,
                                on_change=ui_state.toggle_email_notifications,
                            ),
                            width="100%",
                        ),
                        
                        rx.hstack(
                            rx.text("Push Notifications:"),
                            rx.spacer(),
                            rx.switch(
                                is_checked=ui_state.push_notifications,
                                on_change=ui_state.toggle_push_notifications,
                            ),
                            width="100%",
                            mt="4",
                        ),
                        
                        width="100%",
                        align_items="start",
                        spacing="3",
                    ),
                    mb="6",
                ),
                
                # Save button
                rx.button(
                    "Save Settings",
                    on_click=ui_state.save_settings,
                    is_loading=ui_state.is_saving,
                    color_scheme="green",
                    size="lg",
                    width="full",
                ),
                
                width="100%",
                max_width="800px",
                p="4",
                spacing="4",
            ),
            flex="1",
            ml=rx.cond(not ui_state.is_mobile and session_state.sidebar_visible, "60", "0"),
            transition="all 0.3s ease-in-out",
        ),
        
        # Sidebar (desktop only)
        rx.cond(
            not ui_state.is_mobile and session_state.sidebar_visible,
            rx.box(
                rx.vstack(
                    # Header
                    rx.hstack(
                        rx.heading("EZ Narratives", size="md"),
                        rx.spacer(),
                        width="100%",
                        p="4",
                        border_bottom="1px solid",
                        border_color="gray.200",
                        dark_border_color="gray.700",
                    ),
                    
                    # Navigation
                    rx.vstack(
                        rx.link(
                            rx.hstack(
                                rx.icon("home", size=4),
                                rx.text("Dashboard"),
                                width="100%",
                            ),
                            href="/dashboard",
                            width="100%",
                            p="3",
                            border_radius="md",
                            _hover={"bg": "gray.100", "dark_bg": "gray.800"},
                        ),
                        rx.link(
                            rx.hstack(
                                rx.icon("settings", size=4),
                                rx.text("Settings"),
                                width="100%",
                            ),
                            href="/settings",
                            width="100%",
                            p="3",
                            border_radius="md",
                            bg="gray.100",
                            dark_bg="gray.800",
                            _hover={"bg": "gray.200", "dark_bg": "gray.700"},
                        ),
                        width="100%",
                        align_items="start",
                        p="2",
                        spacing="1",
                    ),
                    
                    rx.spacer(),
                    
                    # Footer
                    rx.vstack(
                        rx.button(
                            rx.hstack(
                                rx.icon("log-out", size=4),
                                rx.text("Logout"),
                            ),
                            variant="ghost",
                            width="100%",
                            justify_content="flex-start",
                            on_click=session_state.logout,
                        ),
                        width="100%",
                        p="4",
                        border_top="1px solid",
                        border_color="gray.200",
                        dark_border_color="gray.700",
                    ),
                    
                    height="100%",
                ),
                position="fixed",
                left="0",
                top="0",
                bottom="0",
                width="60",
                bg="white",
                dark_bg="gray.800",
                border_right="1px solid",
                border_color="gray.200",
                dark_border_color="gray.700",
                z_index="10",
            ),
        ),
        
        direction="row",
        height="100vh",
        overflow="hidden",
    )


# Export the page
page = settings