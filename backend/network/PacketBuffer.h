#pragma once

#include <cstddef>
#include <cstdint>
#include <vector>

namespace systemstar {

class PacketBuffer {
public:
    explicit PacketBuffer(std::size_t maxSize);

    bool append(const std::uint8_t* data, std::size_t length);

    bool consume(std::size_t length);

    const std::vector<std::uint8_t>& bytes() const noexcept;

    std::size_t size() const noexcept;

    std::size_t maxSize() const noexcept;

    bool empty() const noexcept;

    void clear() noexcept;

private:
    std::vector<std::uint8_t> buffer_;
    std::size_t maxSize_;
};

} // namespace systemstar
