#include "../backend/network/TCPServer.h"

#include <cassert>
#include <cstdint>
#include <string>
#include <thread>

using systemstar::Socket;
using systemstar::SocketStatus;
using systemstar::TCPServer;

int main() {
    TCPServer server;

    assert(!server.running());

    assert(server.start("127.0.0.1", 0, 16));
    assert(server.running());

    const std::uint16_t port = server.localPort();

    assert(port != 0);

    std::thread clientThread([port]() {
        Socket client;

        assert(client.create());
        assert(client.connect("127.0.0.1", port));

        const std::string message = "systemStar";

        const auto sendResult = client.send(
            reinterpret_cast<const std::uint8_t*>(message.data()),
            message.size()
        );

        assert(sendResult.status == SocketStatus::Success);
        assert(sendResult.bytes == message.size());

        client.close();
    });

    Socket accepted = server.accept();

    assert(accepted.valid());

    std::uint8_t buffer[64]{};

    const auto receiveResult = accepted.receive(
        buffer,
        sizeof(buffer)
    );

    assert(receiveResult.status == SocketStatus::Success);
    assert(receiveResult.bytes == 10);

    const std::string received(
        reinterpret_cast<const char*>(buffer),
        receiveResult.bytes
    );

    assert(received == "systemStar");

    clientThread.join();

    accepted.close();
    server.stop();

    assert(!accepted.valid());
    assert(!server.running());

    return 0;
}
