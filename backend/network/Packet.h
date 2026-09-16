#pragma once

#include <cstddef>
#include <cstdint>
#include <vector>

namespace systemstar {

class Packet {
public:
    Packet() = default;

    explicit Packet(std::vector<std::uint8_t> bytes);

    const std::vector<std::uint8_t>& bytes() const noexcept;

    std::size_t size() const noexcept;

    bool empty() const noexcept;

private:
    std::vector<std::uint8_t> bytes_;
};

} // namespace systemstar
