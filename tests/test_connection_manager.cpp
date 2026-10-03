#include "network/ConnectionManager.h"
#include "network/TCPServer.h"

#include <cassert>
#include <cstdint>
#include <string>
#include <thread>
#include <utility>

using namespace systemstar;

int main() {
    TCPServer server;

    assert(server.start("127.0.0.1", 0, 4));

    const auto port = server.localPort();
    assert(port != 0);

    ConnectionManager manager;

    assert(manager.size() == 0);

    std::thread clientThread([port]() {
        Socket client;

        assert(client.create());
        if (!client.connect("127.0.0.1", port)) {
            client.close();
            return;
        }

        const std::string message = "connection-manager";

        const auto result = client.send(
            reinterpret_cast<const std::uint8_t*>(message.data()),
            message.size()
        );

        if (result.status != SocketStatus::Success ||
            result.bytes != message.size()) {
            client.close();
            return;
        }

        client.close();
    });

    Socket acceptedSocket = server.accept();
    assert(acceptedSocket.valid());

    Session session(std::move(acceptedSocket));

    const auto connectionId = manager.add(std::move(session));

    assert(connectionId == 1);
    assert(manager.size() == 1);

    Session* storedSession = manager.get(connectionId);

    assert(storedSession != nullptr);
    assert(storedSession->valid());

    std::uint8_t buffer[64]{};

    const auto receiveResult = storedSession->receive(
        buffer,
        sizeof(buffer)
    );

    assert(receiveResult.status == SocketStatus::Success);

    const std::string received(
        reinterpret_cast<const char*>(buffer),
        receiveResult.bytes
    );

    assert(received == "connection-manager");

    assert(manager.get(999999) == nullptr);
    assert(!manager.remove(999999));

    assert(manager.remove(connectionId));
    assert(manager.size() == 0);

    assert(manager.get(connectionId) == nullptr);
    assert(!manager.remove(connectionId));

    clientThread.join();

    server.stop();

    return 0;
}
