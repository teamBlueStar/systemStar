#include "TCPServer.h"

namespace systemstar {

TCPServer::TCPServer()
    : socket_(),
      running_(false) {
}

TCPServer::~TCPServer() {
    stop();
}

bool TCPServer::start(
    const std::string& address,
    std::uint16_t port,
    int backlog
) {
    if (running_) {
        return false;
    }

    if (backlog <= 0) {
        return false;
    }

    if (!socket_.create()) {
        return false;
    }

    if (!socket_.bind(address, port)) {
        socket_.close();
        return false;
    }

    if (!socket_.listen(backlog)) {
        socket_.close();
        return false;
    }

    running_ = true;
    return true;
}

Socket TCPServer::accept() {
    if (!running_) {
        return Socket();
    }

    return socket_.accept();
}

bool TCPServer::running() const noexcept {
    return running_;
}

std::uint16_t TCPServer::localPort() const noexcept {
    return socket_.localPort();
}

void TCPServer::stop() noexcept {
    socket_.close();
    running_ = false;
}

} // namespace systemstar
