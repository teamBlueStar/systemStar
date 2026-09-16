#include "Packet.h"

#include <utility>

namespace systemstar {

Packet::Packet(std::vector<std::uint8_t> bytes)
    : bytes_(std::move(bytes)) {
}

const std::vector<std::uint8_t>& Packet::bytes() const noexcept {
    return bytes_;
}

std::size_t Packet::size() const noexcept {
    return bytes_.size();
}

bool Packet::empty() const noexcept {
    return bytes_.empty();
}

} // namespace systemstar
