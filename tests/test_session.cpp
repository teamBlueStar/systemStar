#include "../backend/network/Session.h"
#include "../backend/network/TCPServer.h"

#include <cassert>
#include <cstdint>
#include <string>
#include <thread>
#include <utility>

using systemstar::Session;
using systemstar::Socket;
using systemstar::SocketStatus;
using systemstar::TCPServer;

int main() {
    TCPServer server;

    assert(server.start("127.0.0.1", 0, 16));

    const std::uint16_t port = server.localPort();

    assert(port != 0);

    std::thread clientThread([](std::uint16_t clientPort) {
        Socket client;

        assert(client.create());
        if (!client.connect("127.0.0.1", clientPort)) {
            client.close();
            return;
        }

        const std::string message = "session-test";

        const auto sendResult = client.send(
            reinterpret_cast<const std::uint8_t*>(message.data()),
            message.size()
        );

        assert(sendResult.status == SocketStatus::Success);
        assert(sendResult.bytes == message.size());
        (void)sendResult;

        std::uint8_t responseBuffer[64]{};

        const auto receiveResult = client.receive(
            responseBuffer,
            sizeof(responseBuffer)
        );

        assert(receiveResult.status == SocketStatus::Success);
        assert(receiveResult.bytes == 3);

        const std::string response(
            reinterpret_cast<const char*>(responseBuffer),
            receiveResult.bytes
        );

        assert(response == "ACK");

        client.close();
    }, port);

    Socket accepted = server.accept();

    assert(accepted.valid());

    Session session(std::move(accepted));

    assert(session.valid());

    std::uint8_t buffer[64]{};

    const auto receiveResult = session.receive(
        buffer,
        sizeof(buffer)
    );

    assert(receiveResult.status == SocketStatus::Success);
    assert(receiveResult.bytes == 12);

    const std::string received(
        reinterpret_cast<const char*>(buffer),
        receiveResult.bytes
    );

    assert(received == "session-test");

    const std::string response = "ACK";

    const auto sendResult = session.send(
        reinterpret_cast<const std::uint8_t*>(response.data()),
        response.size()
    );

    assert(sendResult.status == SocketStatus::Success);
    assert(sendResult.bytes == response.size());
    (void)sendResult;

    clientThread.join();

    session.close();
    server.stop();

    assert(!session.valid());
    assert(!server.running());

    return 0;
}
