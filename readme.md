# MTA-Server: Mail Transfer Agent Fundamentals and Security

This repository provides a comprehensive overview of Mail Transfer Agents (MTAs), the Simple Mail Transfer Protocol (SMTP), and the essential DNS records required for secure and reliable email delivery, authentication, and anti-spam protection.

## Table of Contents

- [How Email Sending & Receiving Works (SMTP Process)](#how-email-sending--receiving-works-smtp-process)
- [Essential Email Authentication Records (DNS)](#essential-email-authentication-records-dns)
  - [MX Record](#mx-record)
  - [SPF Record](#spf-record)
  - [DKIM Record](#dkim-record)
  - [DMARC Record](#dmarc-record)
- [References](#references)

---

## How Email Sending & Receiving Works (SMTP Process)

The SMTP process is the engine that handles mail transfer between mail servers.

### A. Server Identification and Connection

When an email is sent (e.g., from `user@senderdomain.com` to `Support@outlook.com`), the sending mail server must locate the recipient's mail server using DNS:

1. **DNS MX Query**: The sending server queries DNS for the recipient domain (e.g., `outlook.com`) to retrieve its MX Record. This record specifies the mail server responsible for receiving emails for the domain (e.g., `outlook.com MX mailserver.com`).
2. **DNS A Record Query**: The sending server queries DNS for the A record of the mail server identified in the MX record (e.g., `mailserver.com`) to get its public IP address (e.g., `1.2.3.4`).
3. **TCP/SMTP Connection**: The sending server establishes a TCP connection to the receiving SMTP server on the identified IP address, typically on port 25 (SMTP) or 465 (SMTPS).

### B. The SMTP Session (5 Steps)

Once the TCP connection is established, the client (sending server) and the server (receiving server) communicate using SMTP commands:

| Step | Command / Action | Purpose | Server Response Example |
|------|------------------|---------|------------------------|
| 1    | **HELO / EHLO**  | Client introduces itself and initiates the session (e.g., `HELO gmail.com`). | `250 Hello` |
| 2    | **MAIL FROM**    | Specifies the sender's email address, initiating mail transfer (e.g., `MAIL FROM john@gmail.com`). | `250 OK` |
| 3    | **RCPT TO**      | Specifies the recipient's email address. The server checks if the recipient exists (e.g., `RCPT TO hello@receiverdomain.dev`). | `250 OK` |
| 4    | **DATA**         | Client asks for permission to transfer the email's content (headers, subject, body). | `354 Start mail input; end with <CRLF>.<CRLF>` (Granting permission) |
| 5    | **QUIT**         | Client requests to terminate the session and close the connection. | `221 Bye` |

![SMTP Session Steps](image1)

---

## Essential Email Authentication Records (DNS)

These DNS records are critical for email security, anti-spam efforts, and establishing domain legitimacy. They must be configured in the domain's DNS settings.

### A. MX Record (Mail Exchange Record)
- **Function**: Directs incoming emails to the correct mail server for a given domain.
- **Example**: `outlook.com MX mailserver.com`

### B. SPF Record (Sender Policy Framework)
- **Function**: Specifies which IP addresses and domains are authorized to send email on behalf of the domain.
- **Purpose**: Helps prevent email spoofing and spam.
- **Mechanism**: Receiving servers check the SPF record to verify if the sending server's IP is authorized.
- **Example Value**:  
  ```
  "v=spf1 include:example.spf.com -all"
  ```

### C. DKIM Record (DomainKeys Identified Mail)
- **Function**: Provides a mechanism for the sending server to digitally sign the email content.
- **Purpose**: Ensures the email has not been tampered with during transit and verifies the sender is authoritative.
- **Mechanism**:
  - The sending server signs the email using a private key.
  - The corresponding public key is published in the domain's DKIM DNS record.
  - The receiving server uses the public key to verify the signature.

### D. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
- **Function**: Instructs the receiving server on what to do if both SPF and DKIM checks fail (alignment failure).
- **Policy Options (`p`)**:
  - `p=reject`: Do not accept the mail.
  - `p=quarantine`: Place the mail in the spam/junk folder.
  - `p=none`: Accept the mail and report the failure.
- **Example Value**:
  ```
  "v=DMARC1; p=reject; pct=100; adkim=s; aspf=s"
  ```

---

## References

- [Simple Mail Transfer Protocol (SMTP) - RFC 5321](https://datatracker.ietf.org/doc/html/rfc5321)
- [Sender Policy Framework (SPF)](https://tools.ietf.org/html/rfc7208)
- [DomainKeys Identified Mail (DKIM)](https://tools.ietf.org/html/rfc6376)
- [DMARC Specification](https://dmarc.org/)