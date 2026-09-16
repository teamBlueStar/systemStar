#pragma once

#include "../Protocol.h"

namespace systemstar {

class RuptelaProtocol final : public Protocol {
public:
    std::string name() const override;
    bool canHandle(const Packet& packet) const override;
    std::optional<Position> decode(const Packet& packet) const override;
};

}