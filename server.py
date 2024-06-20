import argparse
import socket
import logging


class Server:
    def __init__(self, server_ip: str, server_port: int):
        # UDP socket setup
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        server_address = (server_ip, server_port)
        self.socket.bind(server_address)
        self.logger = logging.getLogger("my-app")

    def __del__(self):
        print("Closing server")
        self.socket.close()

    def run(self):
        print("Starting server... (Ctrl+C to quit)")
        while True:
            data, address = self.socket.recvfrom(4096)
            self.logger.info("Received: {}".format(data.decode('utf-8')))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Basic test server.')
    parser.add_argument('ip', type=str)
    parser.add_argument('port', type=int)

    args = parser.parse_args()

    # Logging config
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S',
    )

    # Run the server
    server = Server(args.ip, args.port)
    server.run()
