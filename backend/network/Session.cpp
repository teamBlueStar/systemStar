#include "Session.h"

#include <utility>

namespace systemstar {

Session::Session(Socket socket)
    : socket_(std::move(socket)) {
}

Session::~Session() {
    close();
}

Session::Session(Session&& other) noexcept
    : socket_(std::move(other.socket_)) {
}

Session& Session::operator=(Session&& other) noexcept {
    if (this != &other) {
        close();

        socket_ = std::move(other.socket_);
    }

    return *this;
}

SocketResult Session::receive(
    std::uint8_t* buffer,
    std::size_t size
) {
    return socket_.receive(buffer, size);
}

SocketResult Session::send(
    const std::uint8_t* data,
    std::size_t size
) {
    return socket_.send(data, size);
}

bool Session::valid() const noexcept {
    return socket_.valid();
}

void Session::close() noexcept {
    socket_.close();
}

} // namespace systemstar
