#pragma once

#include "Session.h"

#include <cstddef>
#include <unordered_map>

namespace systemstar {

class ConnectionManager {
public:
    ConnectionManager() = default;
    ~ConnectionManager();

    ConnectionManager(const ConnectionManager&) = delete;
    ConnectionManager& operator=(const ConnectionManager&) = delete;

    std::size_t add(Session session);

    bool remove(std::size_t connectionId);

    Session* get(std::size_t connectionId);

    std::size_t size() const noexcept;

    void clear() noexcept;

private:
    std::unordered_map<std::size_t, Session> sessions_;
    std::size_t nextConnectionId_ = 1;
};

} // namespace systemstar
