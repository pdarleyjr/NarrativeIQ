"""
ChatPanel Component for EZ Narratives
====================================

This component provides a chat interface for interacting with the AI assistant.
"""

import reflex as rx
from typing import List, Callable, Dict, Any


class Message:
    """Message model for chat sessions."""
    type: str  # 'user' or 'assistant'
    content: str
    timestamp: str


class ChatPanel(rx.Component):
    """A component for the chat interface."""
    
    # Define the library to use
    library = "app.components.dashboard"
    
    # Define the tag
    tag = "ChatPanel"
    
    # Define the properties
    messages: List[Dict[str, Any]]
    user_input: str
    set_user_input: Callable[[str], None]
    handle_send_message: Callable[[], None]
    is_generating: bool
    is_recording: bool
    toggle_speech_recognition: Callable[[], None]
    transcript: str


def chat_panel(
    messages: List[Dict[str, Any]],
    user_input: str,
    set_user_input: Callable[[str], None],
    handle_send_message: Callable[[], None],
    is_generating: bool = False,
    is_recording: bool = False,
    toggle_speech_recognition: Callable[[], None] = None,
    transcript: str = "",
) -> rx.Component:
    """Create a chat panel component.
    
    Args:
        messages: List of chat messages.
        user_input: Current user input text.
        set_user_input: Function to update user input.
        handle_send_message: Function to handle sending messages.
        is_generating: Whether a response is being generated.
        is_recording: Whether speech recognition is active.
        toggle_speech_recognition: Function to toggle speech recognition.
        transcript: Current speech recognition transcript.
        
    Returns:
        A chat panel component.
    """
    is_mobile = rx.use_media_query("(max-width: 768px)")
    
    return rx.motion.div(
        rx.flex(
            # Chat messages area
            rx.box(
                rx.vstack(
                    *[
                        rx.box(
                            rx.vstack(
                                rx.text(message["content"], size="sm"),
                                rx.text(
                                    f"{message['type'].capitalize()} • {message['timestamp']}",
                                    size="xs",
                                    color="gray.500",
                                ),
                                spacing="1",
                                align_items="flex-start",
                            ),
                            bg="white" if message["type"] == "assistant" else "blue.50",
                            dark_bg="gray.800" if message["type"] == "assistant" else "blue.900",
                            p="4",
                            border_radius="md",
                            shadow="sm",
                            width="100%",
                        )
                        for message in messages
                    ],
                    spacing="4",
                    width="100%",
                    overflow_y="auto",
                    p="4",
                    flex="1",
                ),
                overflow_y="auto",
                flex="1",
            ),
            
            # Input area
            rx.box(
                rx.vstack(
                    # Transcript display (conditional)
                    rx.cond(
                        transcript != "",
                        rx.box(
                            rx.text(transcript),
                            bg="gray.100",
                            dark_bg="gray.800",
                            p="2",
                            border_radius="md",
                            mb="1",
                        ),
                    ),
                    
                    # Input field and buttons
                    rx.box(
                        rx.textarea(
                            value=user_input,
                            placeholder="Type your message here or ask for help..." if not is_recording else "Listening...",
                            on_change=set_user_input,
                            on_key_down=lambda e: handle_send_message() if e.key == "Enter" and not e.shift_key else None,
                            min_height="60px" if is_mobile else "70px",
                            resize="none",
                            pr="24",
                            bg="white" if not is_recording else "red.50",
                            dark_bg="gray.800" if not is_recording else "red.900/10",
                        ),
                        
                        # Action buttons
                        rx.hstack(
                            # Quick actions button (mobile only)
                            rx.cond(
                                is_mobile,
                                rx.button(
                                    rx.icon("zap", size=4),
                                    variant="secondary",
                                    size="icon",
                                    aria_label="Quick actions",
                                ),
                            ),
                            
                            # Mic button
                            rx.button(
                                rx.cond(
                                    is_recording,
                                    rx.icon("mic-off", size=4),
                                    rx.icon("mic", size=4),
                                ),
                                variant="secondary" if not is_recording else "destructive",
                                size="icon",
                                on_click=toggle_speech_recognition,
                                aria_label="Toggle speech recognition",
                            ),
                            
                            # Send button
                            rx.button(
                                rx.cond(
                                    is_generating,
                                    rx.spinner(size="sm"),
                                    rx.icon("arrow-up", size=4),
                                ),
                                on_click=handle_send_message,
                                is_disabled=is_generating or user_input.strip() == "",
                                aria_label="Send message",
                                color_scheme="indigo",
                            ),
                            position="absolute",
                            right="2",
                            bottom="2",
                            spacing="1",
                        ),
                        position="relative",
                    ),
                    
                    # Keyboard shortcuts (desktop only)
                    rx.cond(
                        not is_mobile,
                        rx.hstack(
                            rx.text(
                                "Press ",
                                rx.kbd("Enter"),
                                " to send",
                                size="xs",
                                color="gray.500",
                            ),
                            rx.spacer(),
                            rx.button(
                                rx.hstack(
                                    rx.icon("zap", size="3"),
                                    rx.text("Generate Narrative"),
                                ),
                                variant="ghost",
                                size="xs",
                                color_scheme="indigo",
                                on_click=lambda: set_user_input("Generate a narrative"),
                            ),
                            width="100%",
                            mt="2",
                        ),
                    ),
                    width="100%",
                ),
                p="4",
                border_top="1px solid",
                border_color="gray.200",
                dark_border_color="gray.700",
            ),
            
            direction="column",
            height="100%",
        ),
        initial={"opacity": 0},
        animate={"opacity": 1},
        exit={"opacity": 0},
        transition={"type": "spring", "stiffness": 120, "damping": 15},
        class_name="flex flex-col h-full",
    )