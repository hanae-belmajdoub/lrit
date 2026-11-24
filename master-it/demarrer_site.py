from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import webbrowser
import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--port',type=int,default=0)
parser.add_argument('--no-browser',action='store_true')
args=parser.parse_args()
server=ThreadingHTTPServer(('127.0.0.1',args.port),partial(SimpleHTTPRequestHandler,directory=str(Path(__file__).resolve().parent/'dist')))
url='http://127.0.0.1:'+str(server.server_port)+'/'
print('Master Informatique et Télécommunications\nOuvrez : '+url,flush=True)
if not args.no_browser: webbrowser.open(url)
try: server.serve_forever()
except KeyboardInterrupt: server.server_close()
