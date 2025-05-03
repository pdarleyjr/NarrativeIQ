"""
Integrated Dashboard Page for EZ Narratives
=========================================

This page combines the Chat, EMS, and Fire panels into a single dashboard.
"""

import reflex as rx
from datetime import datetime
from typing import Dict, List, Any, Optional

from app.states.session_state import SessionState
from app.states.ui_state import UIState
from app.states.ems_state import EMSState
from app.states.fire_state import FireState
from app.components.dashboard import app_tabs, chat_panel, ems_panel, fire_panel


def integrated_dashboard() -> rx.Component:
    """Create the integrated dashboard page.
    
    Returns:
        The integrated dashboard component.
    """
    # Get the current states
    session_state = SessionState.get_current_state()
    ui_state = UIState.get_current_state()
    ems_state = EMSState.get_current_state()
    fire_state = FireState.get_current_state()
    
    # Check if we're on mobile
    is_mobile = rx.use_media_query("(max-width: 768px)")
    
    # Get the active session data
    active_session_data = None
    for session in session_state.sessions:
        if session.id == session_state.active_session:
            active_session_data = session
            break
    
    # Welcome message for new sessions
    welcome_message = {
        "type": "assistant",
        "content": """# Welcome to EZ Narrative
        
I'm your AI narrative assistant, designed to help EMS professionals create detailed, accurate PCR narratives quickly and efficiently.

## How to Use
- **Type directly** in the input below to ask questions or create a narrative
- **Click the mic button** to use voice input
- **Use the form on the right** to enter patient details
- **Access sessions** from the left panel to continue previous work

## Quick Actions
- Type "Generate narrative" to create a new narrative
- Click on past sessions to view and edit previous reports
- Use the settings icon to customize narrative formatting

Need help? Just ask me anything about EMS narratives, protocols, or how to use this application.""",
        "timestamp": datetime.now().strftime("%I:%M %p")
    }
    
    # Determine which messages to show
    messages = []
    if active_session_data and active_session_data.messages:
        messages = active_session_data.messages
    else:
        messages = [welcome_message]
    
    return rx.flex(
        # Main content area
        rx.box(
            # Tabs
            app_tabs(
                active_tab=ui_state.active_tab,
                on_tab_change=ui_state.set_active_tab,
            ),
            
            # Tab content
            rx.box(
                # Chat Tab
                rx.cond(
                    ui_state.active_tab == "chat",
                    chat_panel(
                        messages=messages,
                        user_input=session_state.user_input,
                        set_user_input=session_state.set_user_input,
                        handle_send_message=session_state.send_message,
                        is_generating=session_state.is_generating,
                        is_recording=session_state.is_recording,
                        toggle_speech_recognition=session_state.toggle_speech_recognition,
                        transcript=session_state.transcript,
                    ),
                ),
                
                # EMS Tab
                rx.cond(
                    ui_state.active_tab == "ems",
                    ems_panel(
                        narrative_text=ems_state.narrative_text,
                        on_generate_narrative=ems_state.generate_narrative,
                        default_form_data=ems_state.form_data,
                    ),
                ),
                
                # Fire Tab
                rx.cond(
                    ui_state.active_tab == "fire",
                    fire_panel(
                        report_text=fire_state.narrative_text,
                        on_generate_report=fire_state.generate_narrative,
                    ),
                ),
                
                flex="1",
                p="0",
                m="0",
                bg="gray.50",
                dark_bg="gray.900",
                border_radius="lg",
                shadow="md",
                overflow="hidden",
            ),
            
            flex="1",
            ml=rx.cond(not is_mobile and session_state.sidebar_visible, "60", "0"),
            transition="all 0.3s ease-in-out",
        ),
        
        # Sidebar (desktop only)
        rx.cond(
            not is_mobile and session_state.sidebar_visible,
            rx.box(
                rx.vstack(
                    # Header
                    rx.hstack(
                        rx.heading("Sessions", size="md"),
                        rx.spacer(),
                        rx.button(
                            rx.icon("plus-circle", size=4),
                            variant="ghost",
                            size="sm",
                            on_click=session_state.create_new_session,
                        ),
                        width="100%",
                        p="4",
                        border_bottom="1px solid",
                        border_color="gray.200",
                        dark_border_color="gray.700",
                    ),
                    
                    # Session list
                    rx.scroll_area(
                        rx.vstack(
                            *[
                                rx.box(
                                    rx.hstack(
                                        rx.vstack(
                                            rx.text(session.name, font_weight="medium"),
                                            rx.text(session.date, size="xs", color="gray.500"),
                                            align_items="flex-start",
                                            spacing="0",
                                        ),
                                        rx.spacer(),
                                        rx.menu(
                                            rx.menu_button(
                                                rx.icon("more-vertical", size=4),
                                                variant="ghost",
                                                size="sm",
                                            ),
                                            rx.menu_list(
                                                rx.menu_item(
                                                    "Rename",
                                                    on_click=lambda: session_state.rename_session(session.id),
                                                ),
                                                rx.menu_item(
                                                    "Delete",
                                                    on_click=lambda: session_state.delete_session(session.id),
                                                    color="red.500",
                                                ),
                                            ),
                                        ),
                                        width="100%",
                                    ),
                                    on_click=lambda: session_state.set_active_session(session.id),
                                    p="3",
                                    border_radius="md",
                                    cursor="pointer",
                                    bg=rx.cond(session.id == session_state.active_session, "gray.100", "transparent"),
                                    dark_bg=rx.cond(session.id == session_state.active_session, "gray.800", "transparent"),
                                    _hover={"bg": "gray.100", "dark_bg": "gray.800"},
                                )
                                for session in session_state.sessions
                            ],
                            width="100%",
                            spacing="1",
                            p="2",
                        ),
                        flex="1",
                    ),
                    
                    # Footer
                    rx.vstack(
                        rx.button(
                            rx.hstack(
                                rx.icon("settings", size=4),
                                rx.text("Settings"),
                            ),
                            variant="ghost",
                            width="100%",
                            justify_content="flex-start",
                            on_click=ui_state.toggle_settings_dialog,
                        ),
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
        
        # Mobile header (mobile only)
        rx.cond(
            is_mobile,
            rx.box(
                rx.hstack(
                    rx.button(
                        rx.icon("menu", size=5),
                        variant="ghost",
                        size="lg",
                        on_click=lambda: session_state.set_sidebar_visible(True),
                    ),
                    rx.heading("EZ Narratives", size="lg"),
                    rx.spacer(),
                    rx.button(
                        rx.icon(rx.cond(ui_state.is_dark_mode, "sun", "moon"), size=5),
                        variant="ghost",
                        size="lg",
                        on_click=ui_state.toggle_dark_mode,
                    ),
                    rx.button(
                        rx.icon("settings", size=5),
                        variant="ghost",
                        size="lg",
                        on_click=ui_state.toggle_settings_dialog,
                    ),
                    p="4",
                ),
                position="fixed",
                top="0",
                left="0",
                right="0",
                bg="white",
                dark_bg="gray.800",
                border_bottom="1px solid",
                border_color="gray.200",
                dark_border_color="gray.700",
                z_index="10",
            ),
        ),
        
        direction="column",
        height="100vh",
        overflow="hidden",
        bg="gray.50",
        dark_bg="gray.900",
    )


# Export the page
page = integrated_dashboard