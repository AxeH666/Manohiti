from __future__ import annotations

import socket
import smtplib

from django.core.mail.backends.smtp import EmailBackend
from django.core.mail.utils import DNS_NAME


class IPv4SMTP(smtplib.SMTP):
    def _get_socket(
        self,
        host: str,
        port: int,
        timeout: float | None,
    ) -> socket.socket:
        if self.debuglevel > 0:
            self._print_debug("connect: to", (host, port), self.source_address)

        last_error: OSError | None = None
        for family, socktype, proto, _, address in socket.getaddrinfo(
            host,
            port,
            socket.AF_INET,
            socket.SOCK_STREAM,
        ):
            sock = socket.socket(family, socktype, proto)
            try:
                if timeout is not None:
                    sock.settimeout(timeout)
                if self.source_address:
                    sock.bind(self.source_address)
                sock.connect(address)
                return sock
            except OSError as exc:
                last_error = exc
                sock.close()

        if last_error is not None:
            raise last_error
        raise OSError(f"No IPv4 address found for SMTP host {host!r}")


class IPv4SMTPSSL(smtplib.SMTP_SSL):
    def _get_socket(
        self,
        host: str,
        port: int,
        timeout: float | None,
    ) -> socket.socket:
        raw_socket = IPv4SMTP._get_socket(self, host, port, timeout)
        return self.context.wrap_socket(raw_socket, server_hostname=self._host)


class IPv4SMTPEmailBackend(EmailBackend):
    connection_class = IPv4SMTP

    def open(self) -> bool | None:
        try:
            return super().open()
        except (OSError, smtplib.SMTPException):
            self.connection = None
            if self.use_ssl:
                raise

        connection_params: dict[str, object] = {
            "local_hostname": DNS_NAME.get_fqdn(),
            "timeout": self.timeout,
        }
        self.connection = IPv4SMTPSSL(self.host, 465, **connection_params)
        if self.username and self.password:
            self.connection.login(self.username, self.password)
        return True
