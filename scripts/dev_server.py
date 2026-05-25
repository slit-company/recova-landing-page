#!/usr/bin/env python3
from __future__ import annotations

import argparse
import http.server
import socketserver
from pathlib import Path


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the mirrored site with cache disabled.")
    parser.add_argument("port", nargs="?", type=int, default=4173, help="Port to listen on")
    parser.add_argument(
        "--directory",
        default=".",
        help="Directory to serve. Defaults to the current working directory.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    directory = Path(args.directory).resolve()
    handler = lambda *a, **kw: NoCacheHandler(*a, directory=str(directory), **kw)

    with ReusableTCPServer(("", args.port), handler) as httpd:
        print(f"Serving {directory} on http://localhost:{args.port} (cache disabled)")
        httpd.serve_forever()


if __name__ == "__main__":
    raise SystemExit(main())
