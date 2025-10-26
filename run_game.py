import argparse
import os
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler
from socketserver import ThreadingTCPServer
from pathlib import Path

#!/usr/bin/env python3
# run_game.py
# Inicia um servidor HTTP servindo a pasta "src" (relativa a este arquivo).

def main():
    parser = argparse.ArgumentParser(description="Servir a pasta 'src' via HTTP")
    parser.add_argument("-p", "--port", type=int, default=8000, help="porta HTTP (padrão: 8000)")
    parser.add_argument("-o", "--open", action="store_true", help="abrir navegador padrão")
    args = parser.parse_args()

    # caminho para a pasta "src" relativa a este arquivo
    base_dir = Path(__file__).resolve().parent
    src_dir = base_dir / "src"

    if not src_dir.exists() or not src_dir.is_dir():
        print(f"Erro: pasta 'src' não encontrada em: {src_dir}", file=sys.stderr)
        sys.exit(1)

    os.chdir(src_dir)
    host = "0.0.0.0"
    addr = (host, args.port)

    handler = SimpleHTTPRequestHandler

    try:
        httpd = ThreadingTCPServer(addr, handler)
        # abrir explicitamente o index.html via 127.0.0.1 para evitar confusão entre
        # 0.0.0.0 (bind) e o endereço que o navegador deve usar para acessar o servidor
        url_local = f"http://127.0.0.1:{args.port}/index.html"
        url_base = f"http://{host}:{args.port}/"
<<<<<<< HEAD
=======
        print(f"Servindo '{src_dir}' em:")
        print(f"  Local (abrir no navegador):   {url_local}")
        print(f"  Bind (externo):               {url_base}")
>>>>>>> f46e2e7 (Corrigir o arquivo .py não estar rodando a versão mais recente do código)

        # iniciar servidor em thread para conseguir escutar entrada do usuário no terminal
        import threading
        server_thread = threading.Thread(target=httpd.serve_forever, kwargs={'poll_interval': 0.5})
        server_thread.daemon = True
        server_thread.start()

        # abrir o navegador automaticamente
        try:
            webbrowser.open(url_local)
        except Exception:
            pass

        # aguardar input do usuário para encerrar o servidor; fechar o terminal também encerra o processo
        try:
            input("Pressione Enter para parar o servidor e sair...\n")
        except KeyboardInterrupt:
            # se o usuário pressionar Ctrl+C no terminal
            pass

        print("Encerrando servidor...")
        httpd.shutdown()
        httpd.server_close()
        server_thread.join()
        print("Servidor parado.")
    except OSError as e:
        print(f"Erro ao iniciar o servidor: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()