"""Keeps SolarMind's own recent log lines in memory so the panel can show them."""

from __future__ import annotations

import logging
from collections import deque
from typing import Any

LOGGER_NAME = __name__.rsplit(".", 1)[0]  # custom_components.solarmind
MAX_ENTRIES = 500


class LogBuffer(logging.Handler):
    """Ring buffer handler on the SolarMind logger (only SolarMind's own messages)."""

    def __init__(self, maxlen: int = MAX_ENTRIES) -> None:
        super().__init__(logging.DEBUG)
        self.entries: deque[dict[str, Any]] = deque(maxlen=maxlen)
        self._seq = 0
        self._level_before_verbose: int | None = None

    def emit(self, record: logging.LogRecord) -> None:
        try:
            message = record.getMessage()
            if record.exc_info:
                message = f"{message}\n{logging.Formatter().formatException(record.exc_info)}"
            self._seq += 1
            self.entries.append(
                {
                    "seq": self._seq,
                    "ts": record.created,
                    "level": record.levelname,
                    "source": record.name.removeprefix(LOGGER_NAME).lstrip(".") or "solarmind",
                    "message": message,
                }
            )
        except Exception:  # noqa: BLE001 - a log handler must never raise
            self.handleError(record)

    def clear(self) -> None:
        self.entries.clear()

    @property
    def verbose(self) -> bool:
        return logging.getLogger(LOGGER_NAME).getEffectiveLevel() <= logging.DEBUG

    def set_verbose(self, enabled: bool) -> None:
        """Debug level for SolarMind until the next restart (not persisted)."""
        logger = logging.getLogger(LOGGER_NAME)
        if enabled:
            if self._level_before_verbose is None:
                self._level_before_verbose = logger.level
            logger.setLevel(logging.DEBUG)
        else:
            logger.setLevel(self._level_before_verbose or logging.NOTSET)
            self._level_before_verbose = None


def async_get_log_buffer(data: dict[str, Any]) -> LogBuffer:
    """Attach the buffer once per HA run and return it."""
    buffer: LogBuffer | None = data.get("log_buffer")
    if buffer is None:
        logger = logging.getLogger(LOGGER_NAME)
        for handler in list(logger.handlers):  # left over from an earlier load of this module
            if type(handler).__name__ == "LogBuffer":
                logger.removeHandler(handler)
        buffer = LogBuffer()
        logger.addHandler(buffer)
        data["log_buffer"] = buffer
    return buffer
