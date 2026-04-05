package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.ContactRequestDto;
import com.driport.driport_backend.entiity.Order;
import com.driport.driport_backend.entiity.Shipment;
import com.driport.driport_backend.entiity.ShipmentStatus;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${app.email.from:no-reply@driport.local}")
    private String fromEmail;

    public EmailNotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOrderConfirmation(Order order) {
        if (!emailEnabled) {
            logger.info("Email disabled. Skipping order confirmation for order {}", order.getId());
            return;
        }

        String subject = "Driport Order Confirmed #" + order.getId();
        String body = """
                <h2>Your order is confirmed</h2>
                <p>Hi %s,</p>
                <p>Thank you for shopping with Driport. Your payment was successful.</p>
                <p><strong>Order ID:</strong> %s</p>
                <p><strong>Total:</strong> INR %s</p>
                <p><strong>Status:</strong> %s</p>
                <p>We will notify you as soon as your shipment progresses.</p>
                """.formatted(order.getCustomerName(), order.getId(), order.getTotalAmount(), order.getStatus());

        sendHtmlEmail(order.getCustomerEmail(), subject, body);
    }

    @Async
    public void sendShipmentStatusUpdate(Order order, Shipment shipment, ShipmentStatus shipmentStatus, String location) {
        if (!emailEnabled) {
            logger.info("Email disabled. Skipping shipment update for order {}", order.getId());
            return;
        }

        String safeLocation = (location == null || location.isBlank()) ? "N/A" : location;
        String subject = "Driport Shipment Update #" + order.getId() + " - " + shipmentStatus.name();
        String body = """
                <h2>Shipment update</h2>
                <p>Hi %s,</p>
                <p>Your order shipment status has changed.</p>
                <p><strong>Order ID:</strong> %s</p>
                <p><strong>Courier:</strong> %s</p>
                <p><strong>Tracking Number:</strong> %s</p>
                <p><strong>Shipment Status:</strong> %s</p>
                <p><strong>Location:</strong> %s</p>
                <p>Thank you for shopping with Driport.</p>
                """.formatted(
                order.getCustomerName(),
                order.getId(),
                shipment.getCourierName(),
                shipment.getTrackingNumber(),
                shipmentStatus.name(),
                safeLocation
        );

        sendHtmlEmail(order.getCustomerEmail(), subject, body);
    }

    @Async
    public void sendContactAutoReply(ContactRequestDto contactRequestDto) {
        if (!emailEnabled) {
            logger.info("Email disabled. Skipping contact auto-reply for {}", contactRequestDto.getEmail());
            return;
        }

        if (contactRequestDto.getEmail() == null || contactRequestDto.getEmail().isBlank()) {
            return;
        }

        String subject = "We received your message - Driport";
        String body = """
                <h2>Thanks for contacting Driport</h2>
                <p>Hi %s,</p>
                <p>We received your message regarding: <strong>%s</strong>.</p>
                <p>Our team will get back to you soon.</p>
                <p>Message summary:</p>
                <blockquote>%s</blockquote>
                """.formatted(
                contactRequestDto.getFirstName() != null ? contactRequestDto.getFirstName() : "there",
                contactRequestDto.getSubject() != null ? contactRequestDto.getSubject() : "General Inquiry",
                contactRequestDto.getMessage() != null ? contactRequestDto.getMessage() : ""
        );

        sendHtmlEmail(contactRequestDto.getEmail(), subject, body);
    }

    private void sendHtmlEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception exception) {
            logger.error("Failed to send email to {} with subject {}", toEmail, subject, exception);
        }
    }
}
