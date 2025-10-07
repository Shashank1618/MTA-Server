MTA-Server: Mail Transfer Agent Fundamentals and Security
This repository is related to the core concepts of Mail Transfer Agents (MTAs), the Simple Mail Transfer Protocol (SMTP), and the essential DNS records required for modern email delivery, authentication, and security.

This documentation is a summary of the underlying mechanisms that allow email to be sent and verified across the internet.

1. How Email Sending & Receiving Works (SMTP Process)
The SMTP process is the engine that handles mail transfer between mail servers.

A. Server Identification and Connection
When a user sends an email (e.g., from user@senderdomain.com to Support@outlook.com), the sending mail server must first locate the recipient's mail server:

DNS MX Query: The sending server queries the Domain Name System (DNS) for the recipient domain (outlook.com) to retrieve its MX Record (Mail Exchange Record). This record specifies the mail server responsible for receiving emails for that domain (e.g., outlook.com MX mailserver.com).

DNS A Record Query: The sending server then queries the DNS for the A record of the mail server identified in the MX record (mailserver.com) to obtain its specific public IP address (e.g., mailserver.com A $\Rightarrow$ 1.2.3.4).

TCP/SMTP Connection: Finally, the sending server establishes a TCP connection to the receiving SMTP server on the identified IP address, typically on port 25 (for standard SMTP) or 465 (for secure SMTPS).

B. The SMTP Session (5 Steps)
Once the TCP connection is established, the client (sending server) and the server (receiving server) communicate using SMTP commands:

Step

Command/Action

Purpose

Server Response Example

1

HELO / EHLO

Client introduces itself and initiates the session (e.g., HELO gmail.com).

250 Hello

2

MAIL FROM

Specifies the sender's email address, initiating a mail transfer (e.g., MAIL FROM john@gmail.com).

250 OK

3

RCPT TO

Specifies the recipient's email address. The server checks if the recipient exists (e.g., RCPT TO hello@receiverdomain.dev).

250 OK

4

DATA

Client asks for permission to transfer the email's content (headers, subject, body).

354 Start mail input; end with <CRLF>.<CRLF> (Granting permission)

5

QUIT

Client sends a request to terminate the session and close the connection.

221 Bye

2. Essential Email Authentication Records (DNS)
These DNS records are critical for email security, anti-spam efforts, and establishing domain legitimacy. They must be configured in the domain's DNS settings.

A. MX Record (Mail Exchange Record)
Function: Directs incoming emails to the correct mail server for a given domain.

Example: outlook.com MX mailserver.com

B. SPF Record (Sender Policy Framework)
Function: Specifies which IP addresses and domains are authorized to send email on behalf of the domain.

Purpose: Helps prevent email spoofing (spam check).

Mechanism: Receiving servers check the SPF record to verify if the sending server's IP is authorized.

Example Value: "v=spf1 include:example.spf.com -all"

C. DKIM Record (DomainKeys Identified Mail)
Function: Provides a mechanism for the sending server to digitally sign the email content.

Purpose: Ensures the email has not been tampered with during transit and verifies the sender is authoritative.

Mechanism:

The sending server signs the email using a Private Key.

The corresponding Public Key is published in the domain's DKIM DNS record.

The receiving server uses the Public Key to decrypt and verify the signature.

D. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
Function: Instructs the receiving server on what to do if both the SPF and DKIM checks fail (known as alignment failure).

Policy Options (p):

p=reject: Do not receive the mail.

p=quarantine: Place the mail in the spam/junk folder.

p=none: Accept the mail and report the failure.

Example Value: "v=DMARC1; p=reject; pct=100; adkim=s; aspf=s"