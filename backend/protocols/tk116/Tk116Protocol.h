#pragma once

#include "../Protocol.h"

namespace systemstar {

class Tk116Protocol final : public Protocol {
public:
    std::string name() const override;
    bool canHandle(const Packet& packet) const override;
    std::optional<Position> decode(const Packet& packet) const override;
};

}