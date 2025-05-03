"""Library modules for EZ Narratives application."""

from lib.supabase import (
    supabase,
    get_pg_connection,
    is_supabase_configured,
    get_current_user,
    sign_in_with_email_password,
    sign_out,
    check_admin_status
)

from lib.openai_client import (
    generate_ems_narrative,
    generate_fire_narrative,
    chat_completion,
    generate_embeddings,
    MODELS
)

__all__ = [
    "supabase",
    "get_pg_connection",
    "is_supabase_configured",
    "get_current_user",
    "sign_in_with_email_password",
    "sign_out",
    "check_admin_status",
    "generate_ems_narrative",
    "generate_fire_narrative",
    "chat_completion",
    "generate_embeddings",
    "MODELS"
]