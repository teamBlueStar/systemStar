#include "Socket.h"

#include <arpa/inet.h>
#include <cerrno>
#include <cstring>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

namespace systemstar {

namespace {

constexpr int InvalidSocket = -1;

} // namespace

Socket::Socket()
    : nativeHandle_(InvalidSocket) {
}

Socket::Socket(int nativeHandle)
    : nativeHandle_(nativeHandle) {
}

Socket::~Socket() {
    close();
}

Socket::Socket(Socket&& other) noexcept
    : nativeHandle_(other.nativeHandle_) {
    other.nativeHandle_ = InvalidSocket;
}

Socket& Socket::operator=(Socket&& other) noexcept {
    if (this != &other) {
        close();

        nativeHandle_ = other.nativeHandle_;
        other.nativeHandle_ = InvalidSocket;
    }

    return *this;
}

bool Socket::create() {
    if (valid()) {
        return true;
    }

    nativeHandle_ = ::socket(AF_INET, SOCK_STREAM, 0);

    return valid();
}

bool Socket::bind(
    const std::string& address,
    std::uint16_t port
) {
    if (!valid()) {
        return false;
    }

    sockaddr_in socketAddress{};
    socketAddress.sin_family = AF_INET;
    socketAddress.sin_port = htons(port);

    if (::inet_pton(
            AF_INET,
            address.c_str(),
            &socketAddress.sin_addr) != 1) {
        return false;
    }

    int reuseAddress = 1;

    if (::setsockopt(
            nativeHandle_,
            SOL_SOCKET,
            SO_REUSEADDR,
            &reuseAddress,
            sizeof(reuseAddress)) < 0) {
        return false;
    }

    return ::bind(
        nativeHandle_,
        reinterpret_cast<const sockaddr*>(&socketAddress),
        sizeof(socketAddress)) == 0;
}

bool Socket::listen(int backlog) {
    if (!valid() || backlog <= 0) {
        return false;
    }

    return ::listen(nativeHandle_, backlog) == 0;
}

Socket Socket::accept() {
    if (!valid()) {
        return Socket();
    }

    sockaddr_in clientAddress{};
    socklen_t clientAddressLength = sizeof(clientAddress);

    const int clientHandle = ::accept(
        nativeHandle_,
        reinterpret_cast<sockaddr*>(&clientAddress),
        &clientAddressLength);

    return Socket(clientHandle);
}

bool Socket::connect(
    const std::string& address,
    std::uint16_t port
) {
    if (!valid()) {
        return false;
    }

    sockaddr_in serverAddress{};
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_port = htons(port);

    if (::inet_pton(
            AF_INET,
            address.c_str(),
            &serverAddress.sin_addr) != 1) {
        return false;
    }

    return ::connect(
        nativeHandle_,
        reinterpret_cast<const sockaddr*>(&serverAddress),
        sizeof(serverAddress)) == 0;
}

SocketResult Socket::send(
    const std::uint8_t* data,
    std::size_t size
) {
    if (!valid() || data == nullptr || size == 0) {
        return {SocketStatus::Error, 0};
    }

    const ssize_t result = ::send(
        nativeHandle_,
        data,
        size,
        MSG_NOSIGNAL);

    if (result > 0) {
        return {
            SocketStatus::Success,
            static_cast<std::size_t>(result)
        };
    }

    if (result == 0) {
        return {SocketStatus::Closed, 0};
    }

    if (errno == EAGAIN || errno == EWOULDBLOCK) {
        return {SocketStatus::WouldBlock, 0};
    }

    return {SocketStatus::Error, 0};
}

SocketResult Socket::receive(
    std::uint8_t* buffer,
    std::size_t size
) {
    if (!valid() || buffer == nullptr || size == 0) {
        return {SocketStatus::Error, 0};
    }

    const ssize_t result = ::recv(
        nativeHandle_,
        buffer,
        size,
        0);

    if (result > 0) {
        return {
            SocketStatus::Success,
            static_cast<std::size_t>(result)
        };
    }

    if (result == 0) {
        return {SocketStatus::Closed, 0};
    }

    if (errno == EAGAIN || errno == EWOULDBLOCK) {
        return {SocketStatus::WouldBlock, 0};
    }

    return {SocketStatus::Error, 0};
}

bool Socket::valid() const noexcept {
    return nativeHandle_ != InvalidSocket;
}

void Socket::close() noexcept {
    if (valid()) {
        ::close(nativeHandle_);
        nativeHandle_ = InvalidSocket;
    }
}

int Socket::nativeHandle() const noexcept {
    return nativeHandle_;
}

std::uint16_t Socket::localPort() const noexcept {
    if (!valid()) {
        return 0;
    }

    sockaddr_in address{};
    socklen_t addressLength = sizeof(address);

    if (::getsockname(
            nativeHandle_,
            reinterpret_cast<sockaddr*>(&address),
            &addressLength) != 0) {
        return 0;
    }

    return ntohs(address.sin_port);
}

} // namespace systemstar
