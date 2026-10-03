#pragma once

#include "Socket.h"

#include <cstddef>
#include <cstdint>

namespace systemstar {

class Session {
public:
    explicit Session(Socket socket);
    ~Session();

    Session(const Session&) = delete;
    Session& operator=(const Session&) = delete;

    Session(Session&& other) noexcept;
    Session& operator=(Session&& other) noexcept;

    SocketResult receive(
        std::uint8_t* buffer,
        std::size_t size
    );

    SocketResult send(
        const std::uint8_t* data,
        std::size_t size
    );

    bool valid() const noexcept;

    void close() noexcept;

private:
    Socket socket_;
};

} // namespace systemstar
