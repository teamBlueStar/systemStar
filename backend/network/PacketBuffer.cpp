#include "network/PacketBuffer.h"

namespace systemstar {

PacketBuffer::PacketBuffer(std::size_t maxSize)
    : maxSize_(maxSize) {
    buffer_.reserve(maxSize_);
}

bool PacketBuffer::append(
    const std::uint8_t* data,
    std::size_t length
) {
    if (length == 0) {
        return true;
    }

    if (data == nullptr) {
        return false;
    }

    if (length > maxSize_ - buffer_.size()) {
        return false;
    }

    buffer_.insert(buffer_.end(), data, data + length);
    return true;
}

bool PacketBuffer::consume(std::size_t length) {
    if (length > buffer_.size()) {
        return false;
    }

    buffer_.erase(
        buffer_.begin(),
        buffer_.begin() + static_cast<std::vector<std::uint8_t>::difference_type>(length)
    );

    return true;
}

const std::vector<std::uint8_t>& PacketBuffer::bytes() const noexcept {
    return buffer_;
}

std::size_t PacketBuffer::size() const noexcept {
    return buffer_.size();
}

std::size_t PacketBuffer::maxSize() const noexcept {
    return maxSize_;
}

bool PacketBuffer::empty() const noexcept {
    return buffer_.empty();
}

void PacketBuffer::clear() noexcept {
    buffer_.clear();
}

} // namespace systemstar
