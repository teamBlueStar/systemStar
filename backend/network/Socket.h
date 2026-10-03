#pragma once

#include <cstddef>
#include <cstdint>
#include <string>

namespace systemstar {

enum class SocketStatus {
    Success,
    Closed,
    WouldBlock,
    Error
};

struct SocketResult {
    SocketStatus status;
    std::size_t bytes;
};

class Socket {
public:
    Socket();
    explicit Socket(int nativeHandle);

    ~Socket();

    Socket(const Socket&) = delete;
    Socket& operator=(const Socket&) = delete;

    Socket(Socket&& other) noexcept;
    Socket& operator=(Socket&& other) noexcept;

    bool create();

    bool bind(const std::string& address, std::uint16_t port);
    bool listen(int backlog);

    Socket accept();

    bool connect(const std::string& address, std::uint16_t port);

    SocketResult send(
        const std::uint8_t* data,
        std::size_t size
    );

    SocketResult receive(
        std::uint8_t* buffer,
        std::size_t size
    );

    bool valid() const noexcept;

    void close() noexcept;

    int nativeHandle() const noexcept;

    std::uint16_t localPort() const noexcept;

private:
    int nativeHandle_;
};

} // namespace systemstar
