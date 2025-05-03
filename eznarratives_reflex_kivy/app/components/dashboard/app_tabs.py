"""
AppTabs Component for EZ Narratives
==================================

This component provides a tabbed interface for navigating between different sections
of the application (Chat, EMS, Fire).
"""

import reflex as rx
from typing import Callable


class AppTabs(rx.Component):
    """A component for tab navigation."""
    
    # Define the library to use
    library = "app.components.dashboard"
    
    # Define the tag
    tag = "AppTabs"
    
    # Define the properties
    active_tab: str
    on_tab_change: Callable[[str], None]


def app_tabs(active_tab: str, on_tab_change: Callable[[str], None]) -> rx.Component:
    """Create a tabbed interface for the dashboard.
    
    Args:
        active_tab: The currently active tab.
        on_tab_change: Callback function when tab is changed.
        
    Returns:
        A tabbed interface component.
    """
    return rx.flex(
        rx.box(
            rx.flex(
                # Chat Tab
                rx.button(
                    rx.flex(
                        rx.icon("message-square", size=4, mr=2),
                        rx.text("Chat"),
                        align_items="center",
                    ),
                    on_click=lambda: on_tab_change("chat"),
                    class_name=f"flex-1 flex items-center justify-center py-2 rounded-full text-sm font-medium transition-all duration-200 {
                        'text-white' if active_tab == 'chat' else 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }",
                ),
                # EMS Tab
                rx.button(
                    rx.flex(
                        rx.icon("stethoscope", size=4, mr=2),
                        rx.text("EMS"),
                        align_items="center",
                    ),
                    on_click=lambda: on_tab_change("ems"),
                    class_name=f"flex-1 flex items-center justify-center py-2 rounded-full text-sm font-medium transition-all duration-200 {
                        'text-white' if active_tab == 'ems' else 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }",
                ),
                # Fire Tab
                rx.button(
                    rx.flex(
                        rx.icon("file-text", size=4, mr=2),
                        rx.text("Fire"),
                        align_items="center",
                    ),
                    on_click=lambda: on_tab_change("fire"),
                    class_name=f"flex-1 flex items-center justify-center py-2 rounded-full text-sm font-medium transition-all duration-200 {
                        'text-white' if active_tab == 'fire' else 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }",
                ),
                justify_content="center",
                py=2,
                px=4,
            ),
            bg="gray-100",
            dark_bg="gray-800",
            rounded="full",
            p=1,
            flex=1,
            max_width="md",
        ),
        justify_content="center",
        py=2,
        px=4,
    )