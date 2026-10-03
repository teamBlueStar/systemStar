#include "../backend/network/Socket.h"

#include <cassert>
#include <cstdint>
#include <cstring>
#include <string>
#include <thread>

using systemstar::Socket;
using systemstar::SocketStatus;

int main() {
    // ---------------------------------------------------------
    // Socket lifecycle
    // ---------------------------------------------------------

    Socket server;

    assert(!server.valid());
    assert(server.create());
    assert(server.valid());

    // Puerto 0: el sistema operativo asigna uno disponible.
    assert(server.bind("127.0.0.1", 0));
    assert(server.localPort() != 0);

    assert(server.listen(1));

    const std::uint16_t port = server.localPort();

    // ---------------------------------------------------------
    // Client -> Server
    // ---------------------------------------------------------

    Socket client;

    assert(client.create());
    assert(client.connect("127.0.0.1", port));

    Socket accepted = server.accept();

    assert(accepted.valid());

    const std::string message = "systemStar";

    const auto sendResult = client.send(
        reinterpret_cast<const std::uint8_t*>(message.data()),
        message.size());

    assert(sendResult.status == SocketStatus::Success);
    assert(sendResult.bytes == message.size());

    std::uint8_t buffer[64]{};

    const auto receiveResult = accepted.receive(
        buffer,
        sizeof(buffer));

    assert(receiveResult.status == SocketStatus::Success);
    assert(receiveResult.bytes == message.size());

    assert(
        std::memcmp(
            buffer,
            message.data(),
            message.size()) == 0
    );

    // ---------------------------------------------------------
    // Server -> Client
    // ---------------------------------------------------------

    const std::string response = "ACK";

    const auto responseSendResult = accepted.send(
        reinterpret_cast<const std::uint8_t*>(response.data()),
        response.size());

    assert(responseSendResult.status == SocketStatus::Success);
    assert(responseSendResult.bytes == response.size());

    std::uint8_t responseBuffer[16]{};

    const auto responseReceiveResult = client.receive(
        responseBuffer,
        sizeof(responseBuffer));

    assert(responseReceiveResult.status == SocketStatus::Success);
    assert(responseReceiveResult.bytes == response.size());

    assert(
        std::memcmp(
            responseBuffer,
            response.data(),
            response.size()) == 0
    );

    // ---------------------------------------------------------
    // Move semantics
    // ---------------------------------------------------------

    Socket moved = std::move(client);

    assert(moved.valid());
    assert(!client.valid());

    // ---------------------------------------------------------
    // Cleanup
    // ---------------------------------------------------------

    accepted.close();
    moved.close();
    server.close();

    assert(!accepted.valid());
    assert(!moved.valid());
    assert(!server.valid());

    return 0;
}
