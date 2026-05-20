import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger(__name__)


def _send(to_email: str, subject: str, html_body: str) -> bool:
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        logger.info("SMTP not configured — skipping email to %s: %s", to_email, subject)
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAILS_FROM_EMAIL, to_email, msg.as_string())
        return True
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to_email, exc)
        return False


def _base_template(content: str) -> str:
    return f"""
    <html><body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:40px 0">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
      <div style="background:#1d4ed8;padding:24px 32px">
        <h1 style="color:#fff;margin:0;font-size:20px">SilverBricks Connect</h1>
      </div>
      <div style="padding:32px">{content}</div>
      <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
        &copy; 2026 SilverBricks Connect &nbsp;|&nbsp;
        <a href="{settings.FRONTEND_URL}/terms" style="color:#6b7280">Terms</a> &nbsp;|&nbsp;
        <a href="{settings.FRONTEND_URL}/privacy" style="color:#6b7280">Privacy</a>
      </div>
    </div></body></html>"""


def send_quote_received(customer_email: str, customer_name: str, job_title: str, job_id: int, price: float) -> bool:
    content = f"""
    <h2 style="color:#111827;margin-top:0">New quote received!</h2>
    <p>Hi {customer_name},</p>
    <p>A tradesperson has submitted a quote of <strong>${price:,.0f} AUD</strong> on your job:</p>
    <p style="font-weight:600;color:#1d4ed8">{job_title}</p>
    <a href="{settings.FRONTEND_URL}/jobs/{job_id}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
      View Quote
    </a>
    <p style="color:#6b7280;font-size:14px">You can accept or decline this quote from your job page.</p>"""
    return _send(customer_email, f"New quote received for \"{job_title}\"", _base_template(content))


def send_quote_accepted(tradesperson_email: str, tradesperson_name: str, job_title: str, job_id: int) -> bool:
    content = f"""
    <h2 style="color:#111827;margin-top:0">Your quote was accepted!</h2>
    <p>Hi {tradesperson_name},</p>
    <p>Great news — the customer has accepted your quote for:</p>
    <p style="font-weight:600;color:#1d4ed8">{job_title}</p>
    <a href="{settings.FRONTEND_URL}/jobs/{job_id}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
      View Job
    </a>
    <p style="color:#6b7280;font-size:14px">Contact the customer to arrange a start date and time.</p>"""
    return _send(tradesperson_email, f"Quote accepted: \"{job_title}\"", _base_template(content))


def send_booking_confirmed(customer_email: str, customer_name: str, business_name: str, slot_datetime: str) -> bool:
    content = f"""
    <h2 style="color:#111827;margin-top:0">Booking confirmed!</h2>
    <p>Hi {customer_name},</p>
    <p>Your booking with <strong>{business_name}</strong> has been confirmed for:</p>
    <p style="font-size:18px;font-weight:600;color:#1d4ed8">{slot_datetime}</p>
    <a href="{settings.FRONTEND_URL}/dashboard/customer/bookings" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
      View My Bookings
    </a>
    <p style="color:#6b7280;font-size:14px">Please arrive on time. If you need to cancel, do so at least 24 hours in advance.</p>"""
    return _send(customer_email, f"Booking confirmed with {business_name}", _base_template(content))


def send_welcome(user_email: str, user_name: str) -> bool:
    content = f"""
    <h2 style="color:#111827;margin-top:0">Welcome to SilverBricks Connect!</h2>
    <p>Hi {user_name},</p>
    <p>Your account is ready. Here&apos;s how to get started:</p>
    <ul style="color:#374151;padding-left:20px">
      <li style="margin-bottom:8px">Post a job and receive quotes from verified tradies</li>
      <li style="margin-bottom:8px">Browse our directory of qualified tradespeople</li>
      <li style="margin-bottom:8px">Book services directly from local businesses</li>
    </ul>
    <a href="{settings.FRONTEND_URL}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
      Get Started
    </a>"""
    return _send(user_email, "Welcome to SilverBricks Connect", _base_template(content))
