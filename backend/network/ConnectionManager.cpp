#include "ConnectionManager.h"

#include <utility>

namespace systemstar {

ConnectionManager::~ConnectionManager() {
    clear();
}

std::size_t ConnectionManager::add(Session session) {
    const std::size_t connectionId = nextConnectionId_++;

    sessions_.emplace(
        connectionId,
        std::move(session)
    );

    return connectionId;
}

bool ConnectionManager::remove(std::size_t connectionId) {
    return sessions_.erase(connectionId) > 0;
}

Session* ConnectionManager::get(std::size_t connectionId) {
    const auto it = sessions_.find(connectionId);

    if (it == sessions_.end()) {
        return nullptr;
    }

    return &it->second;
}

std::size_t ConnectionManager::size() const noexcept {
    return sessions_.size();
}

void ConnectionManager::clear() noexcept {
    sessions_.clear();
}

} // namespace systemstar
