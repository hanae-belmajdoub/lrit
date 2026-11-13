#!/usr/bin/env python3
"""Serveur local LRIT, sans dépendance externe."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser


def main():
    parser = argparse.ArgumentParser(description="Ouvrir le site du LRIT")
    parser.add_argument("--port", type=int, default=0, help="Port local (0 : port disponible automatiquement)")
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    directory = Path(__file__).resolve().parent / "dist"
    handler = partial(SimpleHTTPRequestHandler, directory=str(directory))
    with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
        url = f"http://127.0.0.1:{server.server_port}/"
        print(f"Site du LRIT\nOuvrez : {url}\nArrêter : Ctrl+C", flush=True)
        if not args.no_browser:
            threading.Timer(0.6, lambda: webbrowser.open(url)).start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
