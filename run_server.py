import http.server
import socketserver
import webbrowser
import threading
import os
import sys

# Configurações
PORT = 8000
DIRECTORY = "src"

# Ajusta o diretório de trabalho para o script
os.chdir(os.path.join(os.path.dirname(sys.argv[0]), DIRECTORY))

# Função que inicia o servidor
def start_server():
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Servidor rodando em http://localhost:{PORT}")
        httpd.serve_forever()

# Inicia o servidor em uma thread separada
threading.Thread(target=start_server, daemon=True).start()

# Abre o navegador no index.html
webbrowser.open(f"http://localhost:{PORT}/index.html")

# Mantém o programa aberto até o usuário fechar
input("Pressione Enter para encerrar o servidor...\n")