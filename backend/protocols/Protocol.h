#pragma once

#include "../models/Position.h"
#include "../network/Packet.h"

#include <optional>
#include <string>

namespace systemstar {

class Protocol {
public:
    virtual ~Protocol() = default;
    virtual std::string name() const = 0;
    virtual bool canHandle(const Packet& packet) const = 0;
    virtual std::optional<Position> decode(const Packet& packet) const = 0;
};

}