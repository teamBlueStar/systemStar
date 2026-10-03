#pragma once

#include "Socket.h"

#include <cstdint>
#include <string>

namespace systemstar {

class TCPServer {
public:
    TCPServer();
    ~TCPServer();

    bool start(
        const std::string& address,
        std::uint16_t port,
        int backlog
    );

    Socket accept();

    bool running() const noexcept;

    std::uint16_t localPort() const noexcept;

    void stop() noexcept;

private:
    Socket socket_;
    bool running_;
};

} // namespace systemstar
